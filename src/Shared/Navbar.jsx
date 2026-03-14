import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useScroll, motion, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Heart, LogOut, Package, Settings, User, ShoppingBag } from "lucide-react";

// Local Imports
import logo from "../assets/logo-himalayas.png";
import UserCartWrapper from "@/components/Cart-wrapper";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Store Imports
import { searchProducts } from "@/store/slices/searchSlice";
import { resetAuthSlice } from "@/store/slices/authSlice";
import { persistor } from "@/store/store";

export default function Navbar() {
  const [isMenu, setIsMenu] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { user } = useSelector((state) => state.auth);
  const { cartItems, boxes } = useSelector((state) => state.cart);
  const { wishListItems } = useSelector((state) => state.wishList);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Scroll Animations
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 80) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 20);
  });

  const toggleMenu = () => setIsMenu((prev) => !prev);

  const handleSearch = () => {
    if (searchTerm.trim().length > 2) {
      dispatch(searchProducts(searchTerm.trim()));
      navigate(`/search?keyword=${searchTerm.trim()}`);
      setSearchTerm("");
    }
  };

  const handleLogout = () => {
    dispatch(resetAuthSlice());
    persistor.purge();
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Our Story", path: "/about-us" },
    { name: "Create Box", path: "/custombox" },
    { name: "Journal", path: "/blog" },
    { name: "Contact", path: "/contact-us" },
  ];

  const totalCount = (cartItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0) + (boxes?.length || 0);
  const wishListCount = wishListItems?.length || 0;

  return (
    <>
      {/* 1. GLOBAL CART SHEET (Always available) */}
      <Sheet open={openCart} onOpenChange={setOpenCart}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md bg-[#fdfcf7] border-l border-stone-200 p-0 z-[1100]"
        >
          <UserCartWrapper cartItems={cartItems} setOpenCartSheet={setOpenCart} />
        </SheetContent>
      </Sheet>

      {/* 2. MAIN NAVIGATION */}
      <motion.nav
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`fixed top-0 left-0 w-full z-[1000] px-4 sm:px-10 h-16 md:h-24 flex items-center transition-all duration-500
          ${scrolled ? "bg-[#F08C7D]/95 backdrop-blur-lg shadow-lg" : "bg-[#F08C7D]"}
        `}
      >
        <div className="w-full max-w-[1920px] mx-auto flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="relative z-[110] flex-shrink-0">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-24 sm:w-32 lg:w-40 brightness-0 invert transition-transform hover:scale-105" 
            />
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden lg:flex items-center justify-center gap-8 xl:gap-12 flex-1">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="relative group py-2">
                <span className="text-[10px] xl:text-[11px] font-black uppercase tracking-[0.3em] text-white/80 group-hover:text-white transition-all">
                  {link.name}
                </span>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#B23A2E] rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* UTILITIES (Search, Account, Wishlist, Cart) */}
          <div className="flex items-center gap-2 sm:gap-5 relative z-[110]">
            
            {/* Desktop Search */}
            <div className="relative group hidden xl:block">
              <input
                placeholder="SEARCH..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-40 pl-4 pr-10 py-2 rounded-full bg-white/10 border border-white/10 text-[9px] tracking-widest text-white placeholder-white/40 focus:outline-none focus:bg-white/20 focus:w-56 transition-all duration-500"
              />
              <CiSearch onClick={handleSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-white cursor-pointer opacity-60 hover:opacity-100" />
            </div>

            {/* Account Dropdown */}
            {!user ? (
              <Link to="/login" className="hidden sm:block">
                <button className="px-5 py-2 border border-white/30 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-[#F08C7D] transition-all">
                  Login
                </button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="h-8 w-8 ring-2 ring-white/20 hover:ring-white transition-all cursor-pointer">
                    <AvatarImage src={user?.profile?.profilePhoto} />
                    <AvatarFallback className="bg-stone-800 text-white text-[10px] font-bold">
                      {user.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-none shadow-2xl rounded-sm w-52 mt-4" align="end">
                   <DropdownMenuGroup className="p-2">
                    <DropdownMenuItem className="cursor-pointer py-3" onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" /> Account
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer py-3" onClick={() => navigate("/orders")}>
                      <Package className="mr-2 h-4 w-4" /> My Orders
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer py-3 text-red-600" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Wishlist Icon */}
            <Link to="/wishlist" className="relative p-2 group">
              <Heart className="w-5 h-5 text-white group-hover:fill-white transition-all" strokeWidth={1.5} />
              {wishListCount > 0 && (
                <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center bg-[#B23A2E] text-[8px] font-bold text-white rounded-full">
                  {wishListCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <button onClick={() => setOpenCart(true)} className="relative p-2 group outline-none">
              <ShoppingBag className="w-5 h-5 text-white group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              {totalCount > 0 && (
                <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center bg-[#B23A2E] text-[8px] font-bold text-white rounded-full">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button onClick={toggleMenu} className="lg:hidden p-2 outline-none">
              <div className="flex flex-col items-end gap-1.5">
                <span className={`h-0.5 bg-white transition-all duration-300 ${isMenu ? "w-7 -rotate-45 translate-y-[8px]" : "w-7"}`} />
                <span className={`h-0.5 bg-white transition-all duration-300 ${isMenu ? "opacity-0" : "w-5"}`} />
                <span className={`h-0.5 bg-white transition-all duration-300 ${isMenu ? "w-7 rotate-45 -translate-y-[8px]" : "w-7"}`} />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* 3. MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1040] lg:hidden"
            />
            {/* Sidebar Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[80%] max-w-sm bg-[#1a1a1a] z-[1050] lg:hidden p-10 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase font-bold">Menu</p>
                <FaTimes className="text-white text-xl cursor-pointer" onClick={toggleMenu} />
              </div>

              <nav className="flex flex-col gap-8">
                {navLinks.map((link, idx) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={toggleMenu}
                    className="flex justify-between items-end group"
                  >
                    <span className="text-2xl font-bold text-white/90 tracking-tighter group-hover:text-white group-hover:translate-x-2 transition-all">
                      {link.name}
                    </span>
                    <span className="text-[10px] text-white/10 font-mono italic">0{idx + 1}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-10 border-t border-white/10">
                {!user ? (
                   <Link to="/login" onClick={toggleMenu}>
                    <Button className="w-full bg-white text-black hover:bg-stone-200 rounded-none h-12 text-[11px] font-black uppercase tracking-widest">
                      Login / Register
                    </Button>
                   </Link>
                ) : (
                  <div className="flex items-center gap-4 text-white">
                    <Avatar className="h-10 w-10 border border-white/20">
                      <AvatarImage src={user?.profile?.profilePhoto} />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-xs font-bold uppercase tracking-widest">{user.name}</p>
                      <button onClick={handleLogout} className="text-[10px] text-white/40 text-left hover:text-white transition-colors">Logout</button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}