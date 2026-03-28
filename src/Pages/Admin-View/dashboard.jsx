import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "@/store/slices/dashboardSlice";
import { 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  Package, 
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Orders Today" 
          value={stats.ordersToday} 
          icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
          bgColor="bg-blue-50"
        />
        <StatCard 
          title="Revenue Today" 
          value={`₹${stats.revenueToday.toLocaleString()}`} 
          icon={<DollarSign className="w-6 h-6 text-emerald-600" />}
          bgColor="bg-emerald-50"
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<Users className="w-6 h-6 text-purple-600" />}
          bgColor="bg-purple-50"
        />
        <StatCard 
          title="Orders This Week" 
          value={stats.ordersThisWeek} 
          icon={<Calendar className="w-6 h-6 text-orange-600" />}
          bgColor="bg-orange-50"
        />
        <StatCard 
          title="Revenue This Month" 
          value={`₹${stats.revenueThisMonth.toLocaleString()}`} 
          icon={<TrendingUp className="w-6 h-6 text-rose-600" />}
          bgColor="bg-rose-50"
        />
        <StatCard 
          title="Total Stock" 
          value={stats.totalStock} 
          icon={<Package className="w-6 h-6 text-amber-600" />}
          bgColor="bg-amber-50"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bgColor }) {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${bgColor}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs font-medium text-green-600">
        <span>+4.5% from last period</span>
      </div>
    </div>
  );
}