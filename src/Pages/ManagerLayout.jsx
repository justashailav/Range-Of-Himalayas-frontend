import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Package, BarChart3, ShoppingCart, LayoutDashboard, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ManagerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-200 antialiased">
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 p-8 flex flex-col">
        <div className="mb-12 flex items-center gap-3">
          <div className="h-8 w-8 bg-indigo-500 rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
          <h2 className="text-xl font-black tracking-tight text-white">Range Manager</h2>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={location.pathname === "/manager/dashboard"}
            onClick={() => navigate("/manager/dashboard")} 
          />
          <SidebarItem 
            icon={<Package size={20} />} 
            label="Inventory" 
            active={location.pathname === "/manager/products"}
            onClick={() => navigate("/manager/products")} 
          />
          <SidebarItem 
            icon={<ShoppingCart size={20} />} 
            label="POS System" 
            active={location.pathname === "/manager/pos"}
            onClick={() => navigate("/manager/pos")} 
          />
          <SidebarItem 
            icon={<BarChart3 size={20} />} 
            label="Analytics" 
            active={location.pathname === "/manager/analytics"}
            onClick={() => navigate("/manager/analytics")} 
          />
        </nav>

        {/* PROFILE MINI-CARD */}
        <div className="mt-auto p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
          <div>
            <p className="text-xs font-bold text-white">Admin Account</p>
            <p className="text-[10px] text-slate-400">Shimla Branch</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] -z-10" />
        
        <div className="p-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

const SidebarItem = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`group relative flex items-center justify-between w-full p-4 rounded-xl transition-all duration-300 ${
      active 
        ? "bg-indigo-500/10 text-indigo-400 shadow-[inset_0_0_12px_rgba(99,102,241,0.1)]" 
        : "hover:bg-white/5 text-slate-400 hover:text-slate-100"
    }`}
  >
    <div className="flex items-center gap-4">
      <span className={`transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}>
        {icon}
      </span>
      <span className="text-sm font-semibold tracking-wide">{label}</span>
    </div>
    
    {active && (
      <motion.div 
        layoutId="activeIndicator"
        className="h-5 w-1 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]"
      />
    )}
    {!active && <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />}
  </button>
);