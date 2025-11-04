import React, { Fragment } from "react";
import {
  ClipboardList,
  LayoutDashboardIcon,
  Package,
  PanelLeft,
  ImageIcon,
  Tag
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { FaBlog } from "react-icons/fa";

export default function Adminsidebar({ open, setOpen }) {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <LayoutDashboardIcon />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <Package />, label: "Products", path: "/admin/products" },
    { icon: <ClipboardList />, label: "Orders", path: "/admin/orders" },
    { icon: <Tag />, label: "Coupons", path: "/admin/coupons" },
    { icon: <ImageIcon />, label: "Gallery", path: "/admin/gallery" },
    { icon: <FaBlog />, label: "Blogs", path: "/admin/blog" },
  ];

  const MenuLinks = ({ onClick }) => (
    <div className="mt-6 space-y-3">
      {menuItems.map((item, idx) => (
        <Link
          key={idx}
          to={item.path}
          onClick={onClick} // closes Sheet on mobile
          className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition"
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </div>
  );

  return (
    <Fragment>
      {/* 📱 Mobile Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full bg-white">
            <SheetHeader className="px-4 py-4 border-b">
              <SheetTitle className="flex items-center gap-2">
                <PanelLeft size={26} />
                <span className="text-lg font-bold">Admin Panel</span>
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-4">
              <MenuLinks onClick={() => setOpen(false)} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* 🖥️ Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col border-r bg-white p-6">
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={() => navigate("/admin/dashboard")}
        >
          <PanelLeft size={28} />
          <h1 className="text-xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuLinks />
      </aside>
    </Fragment>
  );
}
