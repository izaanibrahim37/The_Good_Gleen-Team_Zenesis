import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Package, TrendingUp, Users, Leaf } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { DataTable } from '../components/dashboard/DataTable';
import StatsCard from '../components/dashboard/StatsCard';
import MatchingCard from '../components/dashboard/MatchingCard';
import VoiceDataEntry from '../components/VoiceDataEntry';
import { supabase } from '../lib/supabase';

const FarmerDashboard: React.FC = () => {
  const [listings, setListings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalMatches: 0,
    impactMetrics: {
      mealsProvided: 0,
      wastePrevented: 0
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch listings
      const { data: listingsData } = await supabase
        .from('produce_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (listingsData) {
        setListings(listingsData);
        setStats(prev => ({
          ...prev,
          totalListings: listingsData.length,
          activeListings: listingsData.filter(l => l.status === 'active').length
        }));
      }

      // Fetch matches
      const { data: matchesData } = await supabase
        .from('assistance_programs')
        .select(`
          id,
          food_type,
          quantity,
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
    const csv = listings.map(item => ({
      ...item,
      created_at: format(new Date(item.created_at), 'yyyy-MM-dd')
    }));
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(csv[0]).join(",") + "\n" +
      csv.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "listings.csv");
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
            title="Total Listings"
            value={stats.totalListings}
            icon={Package}
            description="All time listings"
          />
          <StatsCard
            title="Active Listings"
            value={stats.activeListings}
            icon={TrendingUp}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Meals Provided"
            value={stats.impactMetrics.mealsProvided}
            icon={Users}
            description="Estimated impact"
          />
          <StatsCard
            title="Waste Prevented"
            value={`${stats.impactMetrics.wastePrevented}kg`}
            icon={Leaf}
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Listings Table */}
          <div className="lg:col-span-2">
            <DataTable
              data={listings}
              columns={columns}
              onExport={handleExport}
            />
          </div>

          {/* Matching NGOs */}
          <div>
            <MatchingCard
              title="Matching NGO Programs"
              matches={matches}
              onAction={(id) => console.log('Match with NGO:', id)}
              actionLabel="Connect"
            />
          </div>
        </div>

        {/* Voice Data Entry */}
        <div className="mt-8">
          <VoiceDataEntry userRole="farmer" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FarmerDashboard;