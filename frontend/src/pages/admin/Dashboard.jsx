import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import api from '../../services/api';
import { Book, Users, AlertCircle, CheckCircle } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// eslint-disable-next-line no-unused-vars
const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
    </div>
    <div className={`p-4 rounded-full ${colorClass}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics');
        setData(response.data);
      } catch (error) {
        console.error("Error fetching analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <AdminLayout><div className="flex h-full items-center justify-center">Loading...</div></AdminLayout>;
  if (!data) return <AdminLayout><div className="flex h-full items-center justify-center">No data</div></AdminLayout>;

  // Chart Data preparation
  const categoryData = {
    labels: data.categoryUsage.map(c => c._id),
    datasets: [
      {
        label: 'Books by Category',
        data: data.categoryUsage.map(c => c.count),
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const popBooksData = {
    labels: data.mostBorrowed.map(m => m._id?.title || 'Unknown'),
    datasets: [
      {
        label: 'Times Borrowed',
        data: data.mostBorrowed.map(m => m.timesBorrowed),
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
        borderRadius: 4,
      },
    ],
  };

  const popBooksOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
        
        {/* Top metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Books" value={data.totalBooks} icon={Book} colorClass="bg-blue-500" />
          <StatCard title="Total Users" value={data.totalUsers} icon={Users} colorClass="bg-green-500" />
          <StatCard title="Active Issues" value={data.activeIssues} icon={AlertCircle} colorClass="bg-amber-500" />
          <StatCard title="Total Issues (All Time)" value={data.totalIssues} icon={CheckCircle} colorClass="bg-purple-500" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Most Borrowed Books</h3>
            <div className="h-72">
               <Bar options={popBooksOptions} data={popBooksData} className="w-full h-full" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Books by Category</h3>
            <div className="h-64 flex items-center justify-center">
               <Doughnut data={categoryData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
