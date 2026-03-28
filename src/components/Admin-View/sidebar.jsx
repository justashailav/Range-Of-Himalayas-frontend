import React, { Fragment } from "react";
import {
  ClipboardList,
  LayoutDashboard,
  Package,
  PanelLeft,
  ImageIcon,
  Tag,
  BookOpenText, // Consistent icon set
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

export default function Adminsidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to check current path

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <Package size={20} />, label: "Products", path: "/admin/products" },
    { icon: <ClipboardList size={20} />, label: "Orders", path: "/admin/orders" },
    { icon: <Tag size={20} />, label: "Coupons", path: "/admin/coupons" },
    { icon: <ImageIcon size={20} />, label: "Gallery", path: "/admin/gallery" },
    { icon: <BookOpenText size={20} />, label: "Blogs", path: "/admin/blog" },
  ];

  const MenuLinks = ({ onClick }) => (
    <nav className="mt-8 space-y-1">
      {menuItems.map((item, idx) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={idx}
            to={item.path}
            onClick={onClick}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 group
              ${isActive 
                ? "bg-indigo-50 text-indigo-700 shadow-sm border-r-4 border-indigo-600 rounded-r-none" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
          >
            <span className={`${isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <Fragment>
      {/* 📱 Mobile Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0 border-r-0">
          <div className="flex flex-col h-full bg-white">
            <SheetHeader className="px-6 py-6 border-b border-gray-100">
              <SheetTitle className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg text-white">
                  <PanelLeft size={22} />
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900">Admin Panel</span>
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-4 py-2">
              <MenuLinks onClick={() => setOpen(false)} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* 🖥️ Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col border-r border-gray-100 bg-white min-h-screen sticky top-0">
        <div className="px-8 py-8">
          <div
            className="flex cursor-pointer items-center gap-3 group"
            onClick={() => navigate("/admin/dashboard")}
          >
            <div className="bg-gray-900 p-2 rounded-xl text-white group-hover:bg-indigo-600 transition-colors">
              <PanelLeft size={24} />
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">STORE ADMIN</h1>
          </div>
          
          <MenuLinks />
        </div>

        {/* Optional: Simple Footer/Profile Section */}
        <div className="mt-auto p-6 border-t border-gray-50">
          <div className="flex items-center gap-3 p-2">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800">Admin User</span>
              <span className="text-xs text-gray-500">Super Admin</span>
            </div>
          </div>
        </div>
      </aside>
    </Fragment>
  );
}