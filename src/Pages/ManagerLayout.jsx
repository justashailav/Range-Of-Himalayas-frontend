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

  // 🔥 Load manager store on mount
  useEffect(() => {
    dispatch(fetchMyStore());
  }, [dispatch]);

  // Page Title helper
  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();
    return path ? path.charAt(0).toUpperCase() + path.slice(1) : "Dashboard";
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 antialiased overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900/40 backdrop-blur-2xl border-r border-white/5 p-6 flex flex-col z-20">
        <div className="mb-10 px-2 flex items-center gap-3">
          <div className="relative">
            <div className="h-9 w-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl rotate-3 shadow-[0_0_20px_rgba(99,102,241,0.4)]" />
            <div className="absolute inset-0 h-9 w-9 bg-white/20 rounded-xl -rotate-3 blur-[2px]" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Manager Panel
          </h2>
        </div>

        {/* MENU */}
        <nav className="space-y-1.5 flex-1">
          <div className="px-3 mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Menu
            </p>
          </div>

          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={location.pathname.includes("dashboard")}
            onClick={() => navigate("/manager/dashboard")}
          />

          <SidebarItem
            icon={<Package size={20} />}
            label="Inventory"
            active={location.pathname.includes("products")}
            onClick={() => navigate("/manager/products")}
          />

          <SidebarItem
            icon={<ShoppingCart size={20} />}
            label="POS System"
            active={location.pathname.includes("pos")}
            onClick={() => navigate("/manager/pos")}
          />

          <SidebarItem
            icon={<BarChart3 size={20} />}
            label="Analytics"
            active={location.pathname.includes("analytics")}
            onClick={() => navigate("/manager/analytics")}
          />
        </nav>

        {/* PROFILE CARD */}
        <div className="mt-auto group cursor-pointer p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px]">
              <div className="h-full w-full rounded-[10px] bg-slate-900 flex items-center justify-center font-bold text-xs">
                {user?.name?.slice(0, 2)?.toUpperCase() || "MG"}
              </div>
            </div>

            <div className="flex-1">
              <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                {user?.name || "Manager"}
              </p>

              <p className="text-[10px] text-slate-500">
                {loading ? "Loading..." : myStore?.name || "No Store Assigned"}
              </p>
            </div>

            <Settings
              size={14}
              className="text-slate-600 group-hover:rotate-90 transition-transform duration-500"
            />
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* HEADER */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#020617]/50 backdrop-blur-md z-10">
          <div>
            <h1 className="text-sm font-medium text-slate-400">
              {myStore?.name ? (
                <>
                  🏬 {myStore.name} /{" "}
                  <span className="text-white">{getPageTitle()}</span>
                </>
              ) : (
                <>
                  Pages / <span className="text-white">{getPageTitle()}</span>
                </>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {/* SEARCH */}
            <div className="relative hidden md:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Search..."
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all w-64"
              />
            </div>

            {/* NOTIFICATION */}
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#020617]" />
            </button>
          </div>
        </header>

        {/* BACKGROUND EFFECT */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-purple-600/5 blur-[120px]" />

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-10 max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
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

// SIDEBAR ITEM
const SidebarItem = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`group relative flex items-center justify-between w-full p-3.5 rounded-xl transition-all duration-300 ${
      active
        ? "bg-indigo-500/10 text-indigo-400"
        : "hover:bg-white/[0.04] text-slate-400 hover:text-slate-100"
    }`}
  >
    <div className="flex items-center gap-3.5">
      <span className={active ? "text-indigo-400" : ""}>{icon}</span>
      <span className={`text-sm ${active ? "text-white" : ""}`}>
        {label}
      </span>
    </div>

    {active ? (
      <motion.div
        layoutId="activeIndicator"
        className="h-6 w-1 bg-indigo-500 rounded-full"
      />
    ) : (
      <ChevronRight size={14} className="opacity-30" />
    )}
  </button>
);