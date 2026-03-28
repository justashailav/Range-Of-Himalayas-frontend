import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "@/store/slices/dashboardSlice";
import { 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign 
} from "lucide-react";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  if (loading) return <div className="flex h-96 items-center justify-center font-medium text-gray-500">Loading Dashboard...</div>;
  if (error) return <div className="p-6 text-red-500 bg-red-50 rounded-lg border border-red-200">{error}</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Analytics Overview</h1>
        <p className="text-gray-500 mt-1">Monitor your store's performance and growth.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard 
          title="Orders Today" 
          value={stats.ordersToday} 
          icon={<ShoppingBag className="w-5 h-5 text-blue-600" />}
          bgColor="bg-blue-50"
        />
        <StatCard 
          title="Revenue Today" 
          value={`₹${stats.revenueToday.toLocaleString()}`} 
          icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
          bgColor="bg-emerald-50"
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<Users className="w-5 h-5 text-purple-600" />}
          bgColor="bg-purple-50"
        />
        <StatCard 
          title="Orders This Week" 
          value={stats.ordersThisWeek} 
          icon={<Calendar className="w-5 h-5 text-orange-600" />}
          bgColor="bg-orange-50"
        />
        <StatCard 
          title="Revenue This Month" 
          value={`₹${stats.revenueThisMonth.toLocaleString()}`} 
          icon={<TrendingUp className="w-5 h-5 text-rose-600" />}
          bgColor="bg-rose-50"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bgColor }) {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${bgColor}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs font-medium text-green-600">
        <span className="bg-green-100 px-1.5 py-0.5 rounded mr-2">↑ 12%</span>
        <span className="text-gray-400 font-normal">vs last month</span>
      </div>
    </div>
  );
}