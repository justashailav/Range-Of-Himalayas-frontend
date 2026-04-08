import { Outlet, useNavigate } from "react-router-dom";
import { Package, BarChart3, ShoppingCart, LayoutDashboard } from "lucide-react";

export default function ManagerLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r p-6 space-y-6">
        <h2 className="text-xl font-black">Manager Panel</h2>

        <SidebarItem icon={<LayoutDashboard />} label="Dashboard" onClick={() => navigate("/manager/dashboard")} />
        <SidebarItem icon={<Package />} label="Products" onClick={() => navigate("/manager/products")} />
        <SidebarItem icon={<ShoppingCart />} label="POS" onClick={() => navigate("/manager/pos")} />
        <SidebarItem icon={<BarChart3 />} label="Analytics" onClick={() => navigate("/manager/analytics")} />
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}

const SidebarItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-100 text-sm font-bold"
  >
    {icon} {label}
  </button>
);