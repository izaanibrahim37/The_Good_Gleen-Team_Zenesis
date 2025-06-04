import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Heart, TrendingUp, Users, Scale } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { DataTable } from '../components/dashboard/DataTable';
import StatsCard from '../components/dashboard/StatsCard';
import MatchingCard from '../components/dashboard/MatchingCard';
import VoiceDataEntry from '../components/VoiceDataEntry';
import { supabase } from '../lib/supabase';

const NgoDashboard: React.FC = () => {
  const [programs, setPrograms] = useState([]);
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState({
    totalPrograms: 0,
    activePrograms: 0,
    peopleHelped: 0,
    foodSaved: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch assistance programs
      const { data: programsData } = await supabase
        .from('assistance_programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (programsData) {
        setPrograms(programsData);
        
        // Calculate impact metrics
        const totalQuantity = programsData.reduce((sum, program) => sum + program.quantity, 0);
        const estimatedMeals = Math.floor(totalQuantity * 2.5); // Assuming each unit provides 2.5 meals
        
        setStats({
          totalPrograms: programsData.length,
          activePrograms: programsData.filter(p => p.status === 'active').length,
          peopleHelped: estimatedMeals,
          foodSaved: totalQuantity
        });
      }

      // Fetch matching produce listings
      const { data: matchesData } = await supabase
        .from('produce_listings')
        .select(`
          id,
          food_type,
          quantity,
          price,
          location,
          created_at,
          status,
          profiles:user_id (
            first_name,
            last_name
          )
        `)
        .eq('status', 'active');

      if (matchesData) {
        setMatches(matchesData.map(match => ({
          id: match.id,
          name: `${match.profiles.first_name} ${match.profiles.last_name}`,
          foodType: match.food_type,
          quantity: match.quantity,
          location: 'Local Area', // You would calculate this based on the geography
          date: new Date(match.created_at),
          status: 'pending'
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const columns = [
    {
      header: 'Food Type',
      accessorKey: 'food_type',
    },
    {
      header: 'Quantity',
      accessorKey: 'quantity',
    },
    {
      header: 'Price',
      accessorKey: 'price',
      cell: ({ row }) => `$${row.original.price}`,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span className={`
          px-2 py-1 text-xs font-medium rounded-full
          ${row.original.status === 'active' ? 'bg-green-100 text-green-800' : ''}
          ${row.original.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${row.original.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
        `}>
          {row.original.status}
        </span>
      ),
    },
    {
      header: 'Created',
      accessorKey: 'created_at',
      cell: ({ row }) => format(new Date(row.original.created_at), 'MMM d, yyyy'),
    },
  ];

  const handleExport = () => {
    const csv = programs.map(item => ({
      ...item,
      created_at: format(new Date(item.created_at), 'yyyy-MM-dd')
    }));
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(csv[0]).join(",") + "\n" +
      csv.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "assistance_programs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Programs"
            value={stats.totalPrograms}
            icon={Heart}
            description="All time assistance programs"
          />
          <StatsCard
            title="Active Programs"
            value={stats.activePrograms}
            icon={TrendingUp}
            trend={{ value: 20, isPositive: true }}
          />
          <StatsCard
            title="People Helped"
            value={stats.peopleHelped}
            icon={Users}
            description="Estimated meals provided"
          />
          <StatsCard
            title="Food Saved"
            value={`${stats.foodSaved}kg`}
            icon={Scale}
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Programs Table */}
          <div className="lg:col-span-2">
            <DataTable
              data={programs}
              columns={columns}
              onExport={handleExport}
            />
          </div>

          {/* Matching Farmers */}
          <div>
            <MatchingCard
              title="Available Produce"
              matches={matches}
              onAction={(id) => console.log('Match with farmer:', id)}
              actionLabel="Request"
            />
          </div>
        </div>

        {/* Voice Data Entry */}
        <div className="mt-8">
          <VoiceDataEntry userRole="ngo" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NgoDashboard;