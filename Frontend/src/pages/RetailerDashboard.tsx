import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ShoppingCart, TrendingUp, Users, DollarSign } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { DataTable } from '../components/dashboard/DataTable';
import StatsCard from '../components/dashboard/StatsCard';
import MatchingCard from '../components/dashboard/MatchingCard';
import VoiceDataEntry from '../components/VoiceDataEntry';
import { supabase } from '../lib/supabase';

const RetailerDashboard: React.FC = () => {
  const [requests, setRequests] = useState([]);
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeRequests: 0,
    totalSpent: 0,
    averagePrice: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch purchase requests
      const { data: requestsData } = await supabase
        .from('purchase_requests')
        .select(`
          *,
          produce_listings (
            food_type,
            price,
            quantity,
            status
          )
        `)
        .order('date_created', { ascending: false });

      if (requestsData) {
        setRequests(requestsData);
        
        // Calculate stats
        const totalSpent = requestsData.reduce((sum, req) => sum + Number(req.price), 0);
        const avgPrice = totalSpent / (requestsData.length || 1);
        
        setStats({
          totalRequests: requestsData.length,
          activeRequests: requestsData.filter(r => r.status === 'active').length,
          totalSpent: totalSpent,
          averagePrice: avgPrice
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
      accessorKey: 'date_created',
      cell: ({ row }) => format(new Date(row.original.date_created), 'MMM d, yyyy'),
    },
  ];

  const handleExport = () => {
    const csv = requests.map(item => ({
      ...item,
      date_created: format(new Date(item.date_created), 'yyyy-MM-dd')
    }));
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(csv[0]).join(",") + "\n" +
      csv.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "purchase_requests.csv");
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
            title="Total Requests"
            value={stats.totalRequests}
            icon={ShoppingCart}
            description="All time purchase requests"
          />
          <StatsCard
            title="Active Requests"
            value={stats.activeRequests}
            icon={TrendingUp}
            trend={{ value: 15, isPositive: true }}
          />
          <StatsCard
            title="Total Spent"
            value={`$${stats.totalSpent.toFixed(2)}`}
            icon={DollarSign}
            description="Total purchase amount"
          />
          <StatsCard
            title="Average Price"
            value={`$${stats.averagePrice.toFixed(2)}`}
            icon={Users}
            trend={{ value: 5, isPositive: false }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Purchase Requests Table */}
          <div className="lg:col-span-2">
            <DataTable
              data={requests}
              columns={columns}
              onExport={handleExport}
            />
          </div>

          {/* Matching Farmers */}
          <div>
            <MatchingCard
              title="Available Produce Listings"
              matches={matches}
              onAction={(id) => console.log('Connect with farmer:', id)}
              actionLabel="Purchase"
            />
          </div>
        </div>

        {/* Voice Data Entry */}
        <div className="mt-8">
          <VoiceDataEntry userRole="retailer" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RetailerDashboard;