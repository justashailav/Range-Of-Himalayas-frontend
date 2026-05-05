import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-himalayas.png";
import UserCartWrapper from "@/components/Cart-wrapper";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowRight,
  Heart,
  LogOut,
  Package,
  Settings,
  User,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { searchProducts } from "@/store/slices/searchSlice";
import { resetAuthSlice } from "@/store/slices/authSlice";
import { persistor } from "@/store/store";
import { useScroll, motion, useMotionValueEvent } from "framer-motion";

export default function Navbar() {
  const [isMenu, setIsMenu] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { cartItems, boxes } = useSelector((state) => state.cart);
  const { wishListItems } = useSelector((state) => state.wishList);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 🔥 THIS LINE IS KEY
  const currentUser = user || {
    name: "Guest User",
    email: "guest@demo.com",
  };

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
    }
  };
  const handleLogout = () => {
    dispatch(resetAuthSlice());
    persistor.purge();
    navigate("/login");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };
  const cartCount =
    cartItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
  const boxCount = boxes?.length || 0;
  const totalCount = cartCount + boxCount;
  const wishListCount = wishListItems?.length || 0;
  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        // Keep visible if menu is open, otherwise hide on scroll
        animate={isMenu ? "visible" : hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-6 lg:px-10 min-h-16 md:h-20 transition-all duration-300
        ${
          scrolled || isMenu
            ? "bg-[#F08C7D]/95 backdrop-blur-md shadow-md"
            : "bg-[#F08C7D]"
        }
      `}
      >
        <div className="flex items-center justify-between w-full mt-2">
          <div className="flex items-center justify-between w-full h-14 lg:hidden px-4">
            {/* 1. LOGO: Scaled down for mobile to keep the bar slim */}
            <Link
              to="/"
              className="group relative flex items-center transition-all duration-500"
            >
              <img
                src={logo}
                alt="Purely Himalayan Logo"
                className="w-20 sm:w-24 h-auto object-contain brightness-0 invert opacity-90 transition-all duration-700"
              />
              {/* Minimalist underline instead of glow for mobile performance */}
              <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#B23A2E] group-hover:w-full transition-all duration-500" />
            </Link>

            {/* 2. ACTION GROUP: Consolidated and balanced */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* WISHLIST */}
              <Link
                to="/wishlist"
                className="relative p-2 active:scale-90 transition-transform"
              >
                <Heart strokeWidth={1.5} className="w-5 h-5 text-white" />
                {wishListCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center bg-[#B23A2E] text-[7px] font-bold text-white rounded-full ring-1 ring-stone-900">
                    {wishListCount}
                  </span>
                )}
              </Link>

              {/* CART */}
              <Sheet open={openCart} onOpenChange={setOpenCart}>
                <div className="relative flex items-center h-full">
                  <div
                    className="group relative p-2 cursor-pointer outline-none"
                    onClick={() => setOpenCart(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-500 group-hover:scale-110 group-hover:text-[#B23A2E]"
                    >
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                      <path d="M3 6h18" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>

                    {totalCount > 0 && (
                      <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center bg-[#B23A2E] text-[8px] font-black text-white rounded-full ring-2 ring-stone-900">
                        {totalCount}
                      </span>
                    )}
                  </div>

                  <SheetContent
                    side="right"
                    className="sm:max-w-md bg-[#fdfcf7] border-l border-stone-200 p-0 shadow-2xl"
                  >
                    <UserCartWrapper
                      cartItems={cartItems}
                      setOpenCartSheet={setOpenCart}
                    />
                  </SheetContent>
                </div>
              </Sheet>

              {/* USER AVATAR: Shshifted slightly to the right with mr-1/mr-2 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative cursor-pointer outline-none active:scale-95 transition-all duration-500 group mr-1 sm:mr-0">
                    <Avatar className="h-9 w-9 ring-offset-2 ring-1 ring-stone-200 group-hover:ring-[#B23A2E] transition-all duration-500 shadow-sm">
                      <AvatarImage
                        src={
                          user?.profile?.profilePhoto ||
                          "https://github.com/shadcn.png"
                        }
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-[#2d3a2d] text-[#fdfcf7] text-[10px] font-bold">
                        {currentUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-[#B23A2E] border-2 border-white rounded-full shadow-sm" />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  /* alignOffset moves the menu relative to the trigger. 
       A negative value shifts it further right beyond the trigger edge. */
                  alignOffset={-4}
                  className="w-64 bg-white/95 backdrop-blur-md border border-stone-200 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[1.5rem] overflow-hidden animate-in fade-in zoom-in-95 duration-300"
                >
                  {/* HEADER SECTION */}
                  <div className="px-4 py-5 mb-1 bg-stone-50/50 rounded-[1.2rem] border border-stone-100/50">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="h-1 w-1 rounded-full bg-[#B23A2E]" />
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400">
                        {user ? "Verified Member" : "Guest Explorer"}
                      </p>
                    </div>
                    <p className="font-serif text-lg italic text-stone-900 truncate leading-tight">
                      {currentUser.name}
                    </p>
                  </div>

                  {/* MENU ITEMS GROUP */}
                  <div className="space-y-0.5">
                    <DropdownMenuItem
                      onClick={() => navigate("/profile")}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl focus:bg-stone-50 cursor-pointer group transition-colors"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 group-focus:bg-white transition-colors">
                        <User className="w-3.5 h-3.5 text-stone-500 group-focus:text-[#B23A2E]" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-600">
                        The Profile
                      </span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => navigate("/account")}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl focus:bg-stone-50 cursor-pointer group transition-colors"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 group-focus:bg-white transition-colors">
                        <Settings className="w-3.5 h-3.5 text-stone-500 group-focus:text-[#B23A2E]" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-600">
                        Settings
                      </span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => navigate("/order-tracking")}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-stone-900 text-white focus:bg-[#2d3a2d] transition-all cursor-pointer mt-2"
                    >
                      <Package className="w-3.5 h-3.5 text-stone-400" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                        Track Your Order
                      </span>
                    </DropdownMenuItem>
                  </div>

                  {/* LOGOUT / LOGIN SECTION */}
                  <div className="mt-2 pt-2 border-t border-stone-100">
                    {user ? (
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl focus:bg-red-50 cursor-pointer group transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5 text-stone-400 group-focus:text-red-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500 group-focus:text-red-600">
                          Sign Out
                        </span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => navigate("/login")}
                        className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#B23A2E] text-white focus:bg-[#962f26] cursor-pointer"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                          Join the Club
                        </span>
                      </DropdownMenuItem>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                onClick={toggleMenu}
                className="p-2 flex items-center justify-center active:scale-90 transition-transform"
                aria-label="Toggle Menu"
              >
                <div className="flex flex-col items-end gap-1 group">
                  <span
                    className={`h-[1.5px] bg-white transition-all duration-500 ${isMenu ? "w-6 -rotate-45 translate-y-[5px]" : "w-6"}`}
                  />
                  <span
                    className={`h-[1.5px] bg-white transition-all duration-500 ${isMenu ? "opacity-0 w-0" : "w-4"}`}
                  />
                  <span
                    className={`h-[1.5px] bg-white transition-all duration-500 ${isMenu ? "w-6 rotate-45 -translate-y-[5px]" : "w-6"}`}
                  />
                </div>
              </button>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-between w-full mb-2">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center h-full transition-all duration-700 ease-in-out hover:scale-105"
            >
              <img
                src={logo}
                className="w-20 sm:w-24 lg:w-28 brightness-0 invert opacity-80 hover:opacity-100 transition-all duration-700 ease-in-out object-contain "
                alt="Range of Himalayas"
              />
            </Link>
            <nav className="flex items-center justify-center gap-6 lg:gap-10 flex-1 h-full px-4">
              {[
                { name: "Home", path: "/" },
                { name: "Our Story", path: "/about-us" },
                { name: "Create Box", path: "/custombox" },
                { name: "Journal", path: "/blog" },
                { name: "Contact", path: "/contact-us" },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative group flex items-center h-full"
                >
                  {/* The Text: Optimized for the Editorial look */}
                  <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.4em] text-white/70 group-hover:text-white transition-all duration-500 whitespace-nowrap">
                    {link.name}
                  </span>

                  {/* The Harvest Dot: Centered below the text */}
                  <span className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#B23A2E] rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out" />
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3 lg:gap-6 h-full">
              <div className="relative group flex items-center h-10 ml-6">
                {/* The Search Input */}
                <input
                  placeholder="SEARCH HARVEST..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-4 pr-10 py-4 rounded-full 
    bg-white/10 backdrop-blur-md border border-white/20
    text-[10px] tracking-[0.2em] text-white placeholder-white/60
    focus:outline-none focus:ring-1 focus:ring-white/40
    transition-all duration-500"
                />

                {/* The Icon: Centered perfectly using top-1/2 and translate */}
                <CiSearch
                  className="absolute right-3 text-white text-lg opacity-70 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={handleSearch}
                />
              </div>

              <div className="relative flex items-center h-full ml-4 lg:ml-6">
                <Link
                  to="/wishlist"
                  className="group relative p-2 outline-none"
                >
                  {/* 1. THE ICON: Thin stroke and consistent height */}
                  <Heart
                    strokeWidth={1.5}
                    className="w-5 h-5 text-white transition-all duration-500 group-hover:scale-110 group-hover:text-[#B23A2E]"
                  />

                  {/* 2. THE BADGE: Smaller, centered, and matching the Harvest Red dot */}
                  {wishListCount > 0 && (
                    <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center bg-[#B23A2E] text-[8px] font-black text-white rounded-full ring-2 ring-stone-900 transition-transform duration-500 group-hover:scale-125">
                      {wishListCount}
                    </span>
                  )}

                  {/* 3. SUBTLE UNDERGLOW: Makes the white icon pop against the orchard background */}
                  <div className="absolute inset-0 bg-white/5 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </Link>
              </div>

              <Sheet open={openCart} onOpenChange={setOpenCart}>
                <div className="relative flex items-center h-full">
                  <div
                    className="group relative p-2 cursor-pointer outline-none"
                    onClick={() => setOpenCart(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-500 group-hover:scale-110 group-hover:text-[#B23A2E]"
                    >
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                      <path d="M3 6h18" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>

                    {totalCount > 0 && (
                      <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center bg-[#B23A2E] text-[8px] font-black text-white rounded-full ring-2 ring-stone-900">
                        {totalCount}
                      </span>
                    )}
                  </div>

                  <SheetContent
                    side="right"
                    className="sm:max-w-md bg-[#fdfcf7] border-l border-stone-200 p-0 shadow-2xl"
                  >
                    <UserCartWrapper
                      cartItems={cartItems}
                      setOpenCartSheet={setOpenCart}
                    />
                  </SheetContent>
                </div>
              </Sheet>
              {/* USER AVATAR: Shshifted slightly to the right with mr-1/mr-2 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative cursor-pointer outline-none active:scale-95 transition-all duration-500 group mr-1 sm:mr-0">
                    <Avatar className="h-9 w-9 ring-offset-2 ring-1 ring-stone-200 group-hover:ring-[#B23A2E] transition-all duration-500 shadow-sm">
                      <AvatarImage
                        src={
                          user?.profile?.profilePhoto ||
                          "https://github.com/shadcn.png"
                        }
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-[#2d3a2d] text-[#fdfcf7] text-[10px] font-bold">
                        {currentUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-[#B23A2E] border-2 border-white rounded-full shadow-sm" />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  /* alignOffset moves the menu relative to the trigger. 
       A negative value shifts it further right beyond the trigger edge. */
                  alignOffset={-4}
                  className="w-64 bg-white/95 backdrop-blur-md border border-stone-200 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[1.5rem] overflow-hidden animate-in fade-in zoom-in-95 duration-300"
                >
                  {/* HEADER SECTION */}
                  <div className="px-4 py-5 mb-1 bg-stone-50/50 rounded-[1.2rem] border border-stone-100/50">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="h-1 w-1 rounded-full bg-[#B23A2E]" />
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400">
                        {user ? "Verified Member" : "Guest Explorer"}
                      </p>
                    </div>
                    <p className="font-serif text-lg italic text-stone-900 truncate leading-tight">
                      {currentUser.name}
                    </p>
                  </div>

                  {/* MENU ITEMS GROUP */}
                  <div className="space-y-0.5">
                    <DropdownMenuItem
                      onClick={() => navigate("/profile")}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl focus:bg-stone-50 cursor-pointer group transition-colors"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 group-focus:bg-white transition-colors">
                        <User className="w-3.5 h-3.5 text-stone-500 group-focus:text-[#B23A2E]" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-600">
                        The Profile
                      </span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => navigate("/account")}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl focus:bg-stone-50 cursor-pointer group transition-colors"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 group-focus:bg-white transition-colors">
                        <Settings className="w-3.5 h-3.5 text-stone-500 group-focus:text-[#B23A2E]" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-600">
                        Settings
                      </span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => navigate("/order-tracking")}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-stone-900 text-white focus:bg-[#2d3a2d] transition-all cursor-pointer mt-2"
                    >
                      <Package className="w-3.5 h-3.5 text-stone-400" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                        Track Your Order
                      </span>
                    </DropdownMenuItem>
                  </div>

                  {/* LOGOUT / LOGIN SECTION */}
                  <div className="mt-2 pt-2 border-t border-stone-100">
                    {user ? (
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl focus:bg-red-50 cursor-pointer group transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5 text-stone-400 group-focus:text-red-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500 group-focus:text-red-600">
                          Sign Out
                        </span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => navigate("/login")}
                        className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#B23A2E] text-white focus:bg-[#962f26] cursor-pointer"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                          Join the Club
                        </span>
                      </DropdownMenuItem>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        {/* IMPORTANT: Move this WHOLE block OUTSIDE of your <motion.nav> */}
      </motion.nav>
      <AnimatePresence>
        {isMenu && (
          <div className="fixed inset-0 z-[999] lg:hidden">
            {/* 1. SOLID OVERLAY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={toggleMenu}
            />

            {/* 2. SIDEBAR: Solid Midnight Onyx */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-[280px] sm:w-[350px] bg-[#111111] shadow-2xl p-8 flex flex-col"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-16">
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[#F08C7D]">
                  Archive / 2026
                </span>
                <button onClick={toggleMenu} className="group p-2">
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <span className="absolute w-5 h-[1px] bg-white rotate-45 group-hover:bg-[#F08C7D] transition-all" />
                    <span className="absolute w-5 h-[1px] bg-white -rotate-45 group-hover:bg-[#F08C7D] transition-all" />
                  </div>
                </button>
              </div>

              {/* 3. NAVIGATION */}
              <nav className="flex flex-col gap-10">
                {[
                  { name: "Home", path: "/" },
                  { name: "Our Story", path: "/about-us" },
                  { name: "Create Box", path: "/custombox" },
                  { name: "Journal", path: "/blog" },
                  { name: "Contact", path: "/contact-us" },
                ].map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link
                      to={link.path}
                      onClick={toggleMenu}
                      className="group flex items-end justify-between pb-3 border-b border-white/5 hover:border-[#F08C7D]/40 transition-all"
                    >
                      <span className="text-lg font-black uppercase tracking-[0.3em] text-white/80 group-hover:text-white group-hover:translate-x-2 transition-all">
                        {link.name}
                      </span>
                      <span className="text-[10px] font-serif italic text-[#F08C7D]/40 mb-1">
                        0{index + 1}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* 4. FOOTER */}
              <div className="mt-auto">
                {!user ? (
                  <Link
                    to="/login"
                    onClick={toggleMenu}
                    className="block group"
                  >
                    <div className="relative overflow-hidden border border-[#F08C7D]/40 py-5 text-center transition-all duration-500 hover:border-[#F08C7D]">
                      <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.4em] text-white transition-colors group-hover:text-[#111111]">
                        Member Login
                      </span>
                      <div className="absolute inset-0 bg-[#F08C7D] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </div>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-[#F08C7D] transition-colors border-t border-white/5"
                  >
                    Exit Archive — {user?.name?.split(" ")[0]}
                  </button>
                )}

                <div className="mt-8 flex flex-col items-center gap-2">
                  <p className="text-[8px] font-black uppercase tracking-[0.6em] text-white/10">
                    Purely Himalayan
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
