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
    <motion.nav
      variants={{
    visible: { y: 0 },
    hidden: { y: "-100%" },
  }}
  /* If isMenu is true, we force "visible". 
     Otherwise, we follow the scroll logic (hidden/visible).
  */
  animate={isMenu ? "visible" : (hidden ? "hidden" : "visible")}
  transition={{ duration: 0.35, ease: "easeInOut" }}
  className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-6 lg:px-10 min-h-16 md:h-20 transition-all duration-300
    ${
      scrolled || isMenu // Force solid color when menu is open
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
              <div
                onClick={() => setOpenCart(true)}
                className="relative p-2 cursor-pointer active:scale-90 transition-transform"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  className="transition-colors duration-500"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {totalCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center bg-[#B23A2E] text-[7px] font-bold text-white rounded-full ring-1 ring-stone-900">
                    {totalCount}
                  </span>
                )}
              </div>
              <SheetContent
                side="right"
                className="sm:max-w-md bg-[#fdfcf7] p-0"
              >
                <UserCartWrapper
                  cartItems={cartItems}
                  setOpenCartSheet={setOpenCart}
                />
              </SheetContent>
            </Sheet>

            {/* USER AVATAR: Scaled to h-8 for mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative cursor-pointer outline-none active:scale-95 transition-transform">
                  <Avatar className="h-8 w-8 ring-1 ring-white/20 shadow-xl">
                    <AvatarImage
                      src={
                        user?.profile?.profilePhoto ||
                        "https://github.com/shadcn.png"
                      }
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-[#2d3a2d] text-[#fdfcf7] text-[10px]">
                      {user?.name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-2 w-2 bg-[#B23A2E] border border-stone-900 rounded-full" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 p-2 mr-6 mt-2 shadow-lg rounded-xl">
                <DropdownMenuGroup>
                  <DropdownMenuContent className="w-56 bg-[#fdfcf7] border border-stone-200 rounded-none p-2 shadow-xl">
                    {user ? (
                      <>
                        {/* HEADER SECTION */}

                        <div className="px-3 py-4 border-b border-stone-100 mb-2">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
                            Member
                          </p>

                          <p className="font-serif italic text-stone-900 truncate">
                            {user?.name || "Explorer"}
                          </p>
                        </div>

                        {/* NAVIGATION LINKS */}

                        <Link to="/profile">
                          <DropdownMenuItem className="flex items-center gap-3 px-3 py-3 cursor-pointer outline-none transition-colors hover:bg-stone-100 focus:bg-stone-100 group">
                            <User
                              className="w-4 h-4 text-stone-400 group-hover:text-[#B23A2E] transition-colors"
                              strokeWidth={1.5}
                            />

                            <span className="text-[11px] font-black uppercase tracking-widest text-stone-700">
                              The Profile
                            </span>
                          </DropdownMenuItem>
                        </Link>

                        <Link to="/account">
                          <DropdownMenuItem className="flex items-center gap-3 px-3 py-3 cursor-pointer outline-none transition-colors hover:bg-stone-100 focus:bg-stone-100 group">
                            <Settings
                              className="w-4 h-4 text-stone-400 group-hover:text-[#B23A2E] transition-colors"
                              strokeWidth={1.5}
                            />

                            <span className="text-[11px] font-black uppercase tracking-widest text-stone-700">
                              Account Settings
                            </span>
                          </DropdownMenuItem>
                        </Link>

                        {/* TRACK ORDER: Refined as an editorial link rather than a heavy button */}

                        <DropdownMenuItem
                          onClick={() => navigate("/order-tracking")}
                          className="flex items-center gap-3 px-3 py-3 cursor-pointer outline-none transition-colors hover:bg-[#2d3a2d] hover:text-white focus:bg-[#2d3a2d] focus:text-white group border-t border-stone-100 mt-2"
                        >
                          <Package
                            className="w-4 h-4 text-stone-400 group-hover:text-white transition-colors"
                            strokeWidth={1.5}
                          />

                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                            Track Current Harvest
                          </span>
                        </DropdownMenuItem>

                        {/* LOGOUT */}

                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-3 cursor-pointer outline-none transition-colors hover:bg-red-50 group"
                        >
                          <LogOut
                            className="w-4 h-4 text-stone-400 group-hover:text-[#B23A2E] transition-colors"
                            strokeWidth={1.5}
                          />

                          <span className="text-[11px] font-black uppercase tracking-widest text-stone-400 group-hover:text-[#B23A2E]">
                            Exit Archive
                          </span>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <Link to="/login">
                        <DropdownMenuItem className="flex items-center gap-3 px-3 py-4 cursor-pointer outline-none bg-[#2d3a2d] text-white hover:bg-stone-800 transition-colors">
                          <User
                            className="w-4 h-4 text-white/60"
                            strokeWidth={1.5}
                          />

                          <span className="text-[11px] font-black uppercase tracking-[0.4em]">
                            Member Login
                          </span>
                        </DropdownMenuItem>
                      </Link>
                    )}
                  </DropdownMenuContent>
                </DropdownMenuGroup>
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
              <Link to="/wishlist" className="group relative p-2 outline-none">
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
                <Sheet open={openCart} onOpenChange={setOpenCart}>
                  <div
                    className="group relative p-2 cursor-pointer outline-none"
                    onClick={() => setOpenCart(true)}
                  >
                    {/* 1. THE ICON: Switching to a sleeker bag/basket icon for a boutique feel */}
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

                    {/* 2. THE BADGE: Using the Harvest Red + Ring for depth */}
                    {totalCount > 0 && (
                      <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center bg-[#B23A2E] text-[8px] font-black text-white rounded-full ring-2 ring-stone-900 transition-transform duration-500 group-hover:scale-125">
                        {totalCount}
                      </span>
                    )}
                  </div>

                  {/* 3. THE SHEET: Styled for the 'Archive' feel */}
                  <SheetContent
                    side="right"
                    className="sm:max-w-md bg-[#fdfcf7] border-l border-stone-200 p-0 shadow-2xl"
                  >
                    {/* UserCartWrapper will handle the internal styling */}
                    <UserCartWrapper
                      cartItems={cartItems}
                      setOpenCartSheet={setOpenCart}
                    />
                  </SheetContent>
                </Sheet>
              </div>
            </Sheet>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center justify-center h-full ml-2">
                  <div className="relative group cursor-pointer outline-none">
                    {/* 1. DECORATIVE OUTER RING: Mimics a wax seal or frame */}
                    <div className="absolute -inset-1 border border-white/5 rounded-full group-hover:border-[#B23A2E]/40 transition-colors duration-700" />

                    {/* 2. THE AVATAR: Perfectly centered */}
                    <Avatar className="h-8 w-8 lg:h-9 lg:w-9 ring-2 ring-stone-900 group-hover:ring-[#B23A2E] transition-all duration-500 shadow-2xl">
                      <AvatarImage
                        src={
                          user?.profile?.profilePhoto ||
                          "https://github.com/shadcn.png"
                        }
                        className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                      />
                      {/* Fallback for when no image exists, using your brand colors */}
                      <AvatarFallback className="bg-[#2d3a2d] text-[#fdfcf7] text-[10px] font-serif italic">
                        {user?.name?.charAt(0) || "PH"}
                      </AvatarFallback>
                    </Avatar>

                    {/* 3. STATUS INDICATOR: A tiny red dot to match your hero icons */}
                    <span className="absolute bottom-0 right-0 h-2 w-2 bg-[#B23A2E] border border-stone-900 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 p-2 mr-6 mt-2 shadow-lg rounded-xl">
                <DropdownMenuGroup className="p-2 space-y-1">
                  {user ? (
                    <>
                      {/* 1. SECTION LABEL */}
                      <div className="px-3 py-2 mb-1">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400">
                          The Explorer
                        </p>
                        <p className="text-[11px] font-serif italic text-stone-800 truncate">
                          {user?.name || "Member"}
                        </p>
                      </div>

                      {/* 2. NAVIGATION LINKS */}
                      <Link to="/profile">
                        <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 cursor-pointer outline-none transition-colors rounded-none hover:bg-stone-100 focus:bg-stone-100 group">
                          <User className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#B23A2E] transition-colors" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-700">
                            Profile Archive
                          </span>
                        </DropdownMenuItem>
                      </Link>

                      <Link to="/account">
                        <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 cursor-pointer outline-none transition-colors rounded-none hover:bg-stone-100 focus:bg-stone-100 group">
                          <Settings className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#B23A2E] transition-colors" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-700">
                            Account Settings
                          </span>
                        </DropdownMenuItem>
                      </Link>

                      {/* 3. TRACK ORDER: Re-styled as an editorial link instead of a heavy button */}
                      <DropdownMenuItem
                        onClick={() => navigate("/order-tracking")}
                        className="flex items-center justify-between px-3 py-3 mt-2 cursor-pointer outline-none bg-[#2d3a2d] text-white hover:bg-stone-800 transition-all rounded-sm"
                      >
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                          Track Your Harvest
                        </span>
                        <ArrowRight className="w-3 h-3 opacity-50" />
                      </DropdownMenuItem>

                      <div className="h-[1px] bg-stone-100 my-2 mx-2" />

                      {/* 4. LOGOUT */}
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 cursor-pointer outline-none group hover:bg-red-50 rounded-none"
                      >
                        <LogOut className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#B23A2E] transition-colors" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 group-hover:text-[#B23A2E]">
                          Exit Ledger
                        </span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <Link to="/login">
                      <DropdownMenuItem className="flex items-center justify-center gap-3 px-3 py-4 cursor-pointer outline-none bg-[#2d3a2d] text-white hover:bg-stone-900 transition-colors">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                          Member Login
                        </span>
                      </DropdownMenuItem>
                    </Link>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMenu && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            {/* 1. BLUR OVERLAY: Animated Fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
              onClick={toggleMenu}
            />

            {/* 2. SIDEBAR: Animated Slide from Right */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-[280px] sm:w-[350px] bg-[#1a241a] shadow-2xl p-8 flex flex-col"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-16">
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/30">
                  Menu / Archive
                </span>
                <button
                  onClick={toggleMenu}
                  className="group p-2 -mr-2 outline-none"
                >
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    <span className="absolute w-6 h-[1px] bg-white/60 rotate-45 group-hover:bg-white group-hover:rotate-90 transition-all duration-500" />
                    <span className="absolute w-6 h-[1px] bg-white/60 -rotate-45 group-hover:bg-white group-hover:rotate-0 transition-all duration-500" />
                  </div>
                </button>
              </div>

              {/* 3. NAVIGATION: Added staggered animation to links */}
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
                      className="group flex items-end justify-between pb-2 border-b border-white/5 hover:border-white/20 transition-colors"
                    >
                      <span className="text-16px sm:text-lg font-black uppercase tracking-[0.4em] text-white/80 group-hover:text-white transition-colors">
                        {link.name}
                      </span>
                      <span className="text-[10px] font-serif italic text-white/20 group-hover:text-[#F08C7D] mb-1 transition-colors">
                        0{index + 1}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* 4. FOOTER: Redesigned for visual hierarchy */}
              <div className="mt-auto">
                {!user ? (
                  <Link
                    to="/login"
                    onClick={toggleMenu}
                    className="block group"
                  >
                    <div className="relative overflow-hidden border border-white/20 py-5 text-center transition-all duration-500 group-hover:border-white">
                      <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.4em] text-white">
                        Member Login
                      </span>
                      <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      <style jsx>{`
                        .group:hover span {
                          color: #1a241a;
                        }
                      `}</style>
                    </div>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors border-t border-white/5"
                  >
                    Exit Account — {user?.name?.split(" ")[0]}
                  </button>
                )}

                <div className="mt-8 flex flex-col items-center gap-2">
                  <div className="h-px w-8 bg-[#F08C7D]/30" />
                  <p className="text-[8px] font-black uppercase tracking-[0.6em] text-white/10">
                    Purely Himalayan
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
