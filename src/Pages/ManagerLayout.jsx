import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Package,
  BarChart3,
  ShoppingCart,
  LayoutDashboard,
  ChevronRight,
  Bell,
  Search,
  Settings,
  MapPin,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchMyStore } from "@/store/slices/storeSlice";

export default function ManagerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { myStore, loading } = useSelector((state) => state.store);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMyStore());
  }, [dispatch]);

  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();
    return path ? path.charAt(0).toUpperCase() + path.slice(1) : "Dashboard";
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 antialiased overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900/40 backdrop-blur-2xl border-r border-white/5 p-6 flex flex-col z-20">
        {/* BRAND SECTION */}
        <div className="mb-10 px-2 flex items-center gap-3">
          <div className="relative h-10 w-10 flex-shrink-0">
            <div className="absolute inset-0 bg-indigo-500 rounded-xl rotate-6 blur-sm opacity-20" />
            <div className="relative h-full w-full bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-lg">
                {myStore?.name?.charAt(0) || "R"}
              </span>
            </div>
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-white truncate leading-tight">
              {myStore?.name || "Range Manager"}
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={`h-1.5 w-1.5 rounded-full ${myStore?.isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                {myStore?.isOpenNow ? "Accepting Orders" : "Closed"}
              </span>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-1 flex-1">
          <SectionLabel label="Operations" />
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={location.pathname.includes("dashboard")}
            onClick={() => navigate("/manager/dashboard")}
          />
          
          {/* Conditional rendering based on your JSON permissions */}
          {myStore?.permissions?.canManageInventory && (
            <SidebarItem
              icon={<Package size={18} />}
              label="Inventory"
              active={location.pathname.includes("products")}
              onClick={() => navigate("/manager/products")}
            />
          )}

          <SidebarItem
            icon={<ShoppingCart size={18} />}
            label="POS System"
            active={location.pathname.includes("pos")}
            onClick={() => navigate("/manager/pos")}
          />

          <SectionLabel label="Reports" className="mt-6" />
          {myStore?.permissions?.canViewReports && (
            <SidebarItem
              icon={<BarChart3 size={18} />}
              label="Analytics"
              active={location.pathname.includes("analytics")}
              onClick={() => navigate("/manager/analytics")}
            />
          )}
        </nav>

        {/* STORE FOOTER CARD */}
        <div className="mt-auto space-y-3">
          {/* Store Location Info */}
          <div className="px-3 py-2 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
            <div className="flex items-start gap-2">
              <MapPin size={12} className="text-indigo-400 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                {myStore?.address?.city}, {myStore?.address?.state}
              </p>
            </div>
          </div>

          {/* USER CARD */}
          <div className="group cursor-pointer p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1.5px]">
                <div className="h-full w-full rounded-[7px] bg-slate-900 flex items-center justify-center font-bold text-[10px]">
                  {user?.name?.slice(0, 2)?.toUpperCase() || "AD"}
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold text-white truncate">
                  {user?.name || "Manager"}
                </p>
                <div className="flex items-center gap-1">
                   <ShieldCheck size={10} className="text-indigo-400" />
                   <p className="text-[9px] text-slate-500 font-medium uppercase tracking-tighter">Verified Manager</p>
                </div>
              </div>
              <Settings size={14} className="text-slate-600 group-hover:rotate-45 transition-transform" />
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* HEADER */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#020617]/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
             <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-400">
                <Clock size={12} />
                <span>Shift: 09:00 AM - 09:00 PM</span>
             </div>
             <h1 className="text-xs font-medium text-slate-500">
               <span className="text-white font-bold">{getPageTitle()}</span>
             </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="text"
                placeholder="Search orders..."
                className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-indigo-500/50 transition-all w-48 focus:w-64"
              />
            </div>

            <button className="relative p-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-full border border-white/10">
              <Bell size={18} />
              <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* BACKGROUND EFFECT */}
        <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] pointer-events-none" />
        
        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 max-w-[1600px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

const SectionLabel = ({ label, className }) => (
  <div className={`px-3 mb-2 ${className}`}>
    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-600">
      {label}
    </p>
  </div>
);

const SidebarItem = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`group relative flex items-center justify-between w-full p-3 rounded-xl transition-all duration-200 ${
      active
        ? "bg-indigo-500/10 text-indigo-400 shadow-[inset_0_0_10px_rgba(99,102,241,0.05)]"
        : "hover:bg-white/[0.04] text-slate-400 hover:text-slate-100"
    }`}
  >
    <div className="flex items-center gap-3">
      <span className={`transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}>
        {icon}
      </span>
      <span className={`text-sm font-medium ${active ? "text-white" : ""}`}>
        {label}
      </span>
    </div>

    {active ? (
      <motion.div
        layoutId="activeIndicator"
        className="h-5 w-1 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]"
      />
    ) : (
      <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-20 group-hover:translate-x-0 transition-all" />
    )}
  </button>
);