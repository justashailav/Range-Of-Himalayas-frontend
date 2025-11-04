import { getDashboardStats } from "@/store/slices/dashboardSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Orders Today" value={stats.ordersToday} />
          <Card title="Orders This Week" value={stats.ordersThisWeek} />
          <Card title="Revenue Today" value={`₹${stats.revenueToday}`} />
          <Card title="Revenue This Month" value={`₹${stats.revenueThisMonth}`} />
          <Card title="Total Users" value={stats.totalUsers} />
          <Card title="Total Stock" value={stats.totalStock} />
        </div>
      )}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-5 text-center">
      <h3 className="text-gray-600 text-sm font-semibold mb-2">{title}</h3>
      <p className="text-2xl font-bold text-indigo-600">{value}</p>
    </div>
  );
}
