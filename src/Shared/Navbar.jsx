import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaTimes, FaShoppingCart } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-himalayas.png";
import UserCartWrapper from "@/components/Cart-wrapper";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  ShoppingBag,
  User,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { searchProducts } from "@/store/slices/searchSlice";
import { Button } from "@/components/ui/button";
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
  //   <motion.nav
  //     variants={{
  //       visible: { y: 0 },
  //       hidden: { y: "-100%" },
  //     }}
  //     animate={hidden ? "hidden" : "visible"}
  //     transition={{ duration: 0.35, ease: "easeInOut" }}
  //     className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-6 lg:px-10 min-h-16 md:h-20 transition-all duration-300
  //       ${
  //         scrolled
  //           ? "bg-[#F08C7D]/95 backdrop-blur-md shadow-md"
  //           : "bg-[#F08C7D]"
  //       }
  //     `}
  //   >
  //     <div className="flex items-center justify-between w-full">
  //       <div className="flex items-center justify-between w-full md:flex lg:hidden">
  //         <Link
  //           to="/"
  //           className="group relative flex items-center justify-center py-4 transition-all duration-500"
  //         >
  //           {/* Subtle "Light" glow behind logo on hover */}
  //           <div className="absolute inset-0 bg-stone-200/20 blur-2xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700" />

  //           <img
  //             src={logo}
  //             alt="Purely Himalayan Logo"
  //             className="relative z-10 w-24 sm:w-32 h-auto object-contain 
  //              brightness-90 group-hover:brightness-110 
  //              group-hover:scale-105 transition-all duration-700 
  //              ease-[cubic-bezier(0.23,1,0.32,1)]"
  //           />

  //           {/* The "Signature" underline that only appears on hover */}
  //           <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#B23A2E] group-hover:w-8 transition-all duration-500" />
  //         </Link>

  //         <div className="flex items-center gap-4 sm:gap-4 mt-2">
  //           <Sheet open={openCart} onOpenChange={setOpenCart}>
  //             <div className="relative group">
  //               <Link to="/wishlist" className="flex items-center gap-2">
  //                 {/* 1. THE ICON: Thin stroke for a delicate, artisanal feel */}
  //                 <div className="relative p-2 transition-transform duration-500 group-hover:scale-110">
  //                   <Heart
  //                     strokeWidth={1.5}
  //                     className="w-5 h-5 text-white transition-colors duration-500 group-hover:text-[#B23A2E]"
  //                   />

  //                   {/* 2. THE NOTIFICATION: Minimalist & Flat */}
  //                   {wishListCount > 0 && (
  //                     <motion.span
  //                       initial={{ scale: 0 }}
  //                       animate={{ scale: 1 }}
  //                       className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center bg-[#B23A2E] text-[8px] font-black text-white rounded-full ring-2 ring-stone-900"
  //                     >
  //                       {wishListCount}
  //                     </motion.span>
  //                   )}
  //                 </div>

  //                 {/* 3. OPTIONAL LABEL: Only shows on larger screens for that "Journal" feel */}
  //                 <span className="hidden lg:block text-[9px] font-black uppercase tracking-[0.3em] text-white/60 group-hover:text-white transition-colors duration-500">
  //                   Saved Records
  //                 </span>
  //               </Link>

  //               {/* 4. UNDERLINE ACCENT: A thin red line that grows on hover */}
  //               <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#B23A2E] group-hover:w-full transition-all duration-700" />
  //             </div>

  //             <div className="relative group">
  //               <div
  //                 onClick={() => setOpenCart(true)}
  //                 className="flex items-center gap-2 cursor-pointer"
  //               >
  //                 {/* 1. THE ICON: Switching to a sleeker 'ShoppingBag' for an artisanal boutique feel */}
  //                 <div className="relative p-2 transition-transform duration-500 group-hover:-translate-y-1">
  //                   <svg
  //                     xmlns="http://www.w3.org/2000/svg"
  //                     width="24"
  //                     height="24"
  //                     viewBox="0 0 24 24"
  //                     fill="none"
  //                     stroke="white"
  //                     strokeWidth="1.5"
  //                     strokeLinecap="round"
  //                     strokeLinejoin="round"
  //                     className="transition-colors duration-500 group-hover:text-[#B23A2E]"
  //                   >
  //                     <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
  //                     <path d="M3 6h18" />
  //                     <path d="M16 10a4 4 0 0 1-8 0" />
  //                   </svg>

  //                   {/* 2. THE COUNT: Refined and balanced */}
  //                   {totalCount > 0 && (
  //                     <motion.span
  //                       initial={{ opacity: 0, y: 5 }}
  //                       animate={{ opacity: 1, y: 0 }}
  //                       className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center bg-[#B23A2E] text-[8px] font-black text-white rounded-full ring-2 ring-stone-900"
  //                     >
  //                       {totalCount}
  //                     </motion.span>
  //                   )}
  //                 </div>

  //                 {/* 3. EDITORIAL LABEL: Adds to the Journal/Catalog aesthetic */}
  //                 <div className="hidden xl:flex flex-col items-start leading-none">
  //                   <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white group-hover:text-[#B23A2E] transition-colors duration-500">
  //                     Provisions
  //                   </span>
  //                   <span className="text-[7px] font-mono text-white/40 uppercase tracking-widest mt-1">
  //                     Your Selection
  //                   </span>
  //                 </div>
  //               </div>

  //               {/* 4. INTERACTION LINE */}
  //               <div className="absolute -bottom-1 right-0 w-0 h-[1px] bg-[#B23A2E] group-hover:w-full transition-all duration-700" />
  //             </div>
  //             <SheetContent side="right" className="sm:max-w-md">
  //               <UserCartWrapper
  //                 cartItems={cartItems}
  //                 setOpenCartSheet={setOpenCart}
  //               />
  //             </SheetContent>
  //           </Sheet>
  //           <DropdownMenu>
  //             <DropdownMenuTrigger asChild>
  //               <div className="relative group cursor-pointer outline-none">
  //                 {/* 1. DECORATIVE OUTER RING (The "Seal") */}
  //                 <div className="absolute -inset-1 border border-white/10 rounded-full group-hover:border-[#B23A2E]/50 transition-colors duration-500" />

  //                 {/* 2. THE AVATAR CONTAINER */}
  //                 <Avatar className="h-9 w-9 sm:h-10 sm:w-10 ring-2 ring-stone-900 group-hover:ring-[#B23A2E] transition-all duration-500 shadow-2xl">
  //                   <AvatarImage
  //                     src={
  //                       user?.profile?.profilePhoto ||
  //                       "https://github.com/shadcn.png"
  //                     }
  //                     className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
  //                   />
  //                   {/* 3. CUSTOM FALLBACK (Initials in Journal Font) */}
  //                   <AvatarFallback className="bg-[#2d3a2d] text-[#fdfcf7] font-serif italic text-xs">
  //                     {user?.name?.charAt(0) || "A"}
  //                   </AvatarFallback>
  //                 </Avatar>

  //                 {/* 4. STATUS INDICATOR (Minimalist dot) */}
  //                 <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-[#B23A2E] border-2 border-stone-900 rounded-full shadow-sm" />

  //                 {/* 5. HOVER LABEL (Optional, for that "Catalog" feel) */}
  //                 <div className="absolute top-full mt-4 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
  //                   <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white whitespace-nowrap bg-stone-900 px-3 py-1 rounded-sm">
  //                     Account Ledger
  //                   </span>
  //                 </div>
  //               </div>
  //             </DropdownMenuTrigger>
  //             <DropdownMenuContent className="w-56 p-2 mr-6 mt-2 shadow-lg rounded-xl">
  //               <DropdownMenuGroup>
  //                 <DropdownMenuContent className="w-56 bg-[#fdfcf7] border border-stone-200 rounded-none p-2 shadow-xl">
  //                   {user ? (
  //                     <>
  //                       {/* HEADER SECTION */}
  //                       <div className="px-3 py-4 border-b border-stone-100 mb-2">
  //                         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
  //                           Member
  //                         </p>
  //                         <p className="font-serif italic text-stone-900 truncate">
  //                           {user?.name || "Explorer"}
  //                         </p>
  //                       </div>

  //                       {/* NAVIGATION LINKS */}
  //                       <Link to="/profile">
  //                         <DropdownMenuItem className="flex items-center gap-3 px-3 py-3 cursor-pointer outline-none transition-colors hover:bg-stone-100 focus:bg-stone-100 group">
  //                           <User
  //                             className="w-4 h-4 text-stone-400 group-hover:text-[#B23A2E] transition-colors"
  //                             strokeWidth={1.5}
  //                           />
  //                           <span className="text-[11px] font-black uppercase tracking-widest text-stone-700">
  //                             The Profile
  //                           </span>
  //                         </DropdownMenuItem>
  //                       </Link>

  //                       <Link to="/account">
  //                         <DropdownMenuItem className="flex items-center gap-3 px-3 py-3 cursor-pointer outline-none transition-colors hover:bg-stone-100 focus:bg-stone-100 group">
  //                           <Settings
  //                             className="w-4 h-4 text-stone-400 group-hover:text-[#B23A2E] transition-colors"
  //                             strokeWidth={1.5}
  //                           />
  //                           <span className="text-[11px] font-black uppercase tracking-widest text-stone-700">
  //                             Account Settings
  //                           </span>
  //                         </DropdownMenuItem>
  //                       </Link>

  //                       {/* TRACK ORDER: Refined as an editorial link rather than a heavy button */}
  //                       <DropdownMenuItem
  //                         onClick={() => navigate("/order-tracking")}
  //                         className="flex items-center gap-3 px-3 py-3 cursor-pointer outline-none transition-colors hover:bg-[#2d3a2d] hover:text-white focus:bg-[#2d3a2d] focus:text-white group border-t border-stone-100 mt-2"
  //                       >
  //                         <Package
  //                           className="w-4 h-4 text-stone-400 group-hover:text-white transition-colors"
  //                           strokeWidth={1.5}
  //                         />
  //                         <span className="text-[10px] font-black uppercase tracking-[0.2em]">
  //                           Track Current Harvest
  //                         </span>
  //                       </DropdownMenuItem>

  //                       {/* LOGOUT */}
  //                       <DropdownMenuItem
  //                         onClick={handleLogout}
  //                         className="flex items-center gap-3 px-3 py-3 cursor-pointer outline-none transition-colors hover:bg-red-50 group"
  //                       >
  //                         <LogOut
  //                           className="w-4 h-4 text-stone-400 group-hover:text-[#B23A2E] transition-colors"
  //                           strokeWidth={1.5}
  //                         />
  //                         <span className="text-[11px] font-black uppercase tracking-widest text-stone-400 group-hover:text-[#B23A2E]">
  //                           Exit Archive
  //                         </span>
  //                       </DropdownMenuItem>
  //                     </>
  //                   ) : (
  //                     <Link to="/login">
  //                       <DropdownMenuItem className="flex items-center gap-3 px-3 py-4 cursor-pointer outline-none bg-[#2d3a2d] text-white hover:bg-stone-800 transition-colors">
  //                         <User
  //                           className="w-4 h-4 text-white/60"
  //                           strokeWidth={1.5}
  //                         />
  //                         <span className="text-[11px] font-black uppercase tracking-[0.4em]">
  //                           Member Login
  //                         </span>
  //                       </DropdownMenuItem>
  //                     </Link>
  //                   )}
  //                 </DropdownMenuContent>
  //               </DropdownMenuGroup>
  //             </DropdownMenuContent>
  //           </DropdownMenu>

  //           <button
  //             onClick={toggleMenu}
  //             className="relative z-[100] p-2 flex items-center justify-center transition-all duration-300 active:scale-90"
  //             aria-label="Toggle Menu"
  //           >
  //             <div className="flex flex-col items-end gap-1.5 group">
  //               {/* Top Line */}
  //               <span
  //                 className={`h-[1.5px] bg-white transition-all duration-500 ease-in-out ${
  //                   isMenu
  //                     ? "w-8 -rotate-45 translate-y-[8px]"
  //                     : "w-8 group-hover:w-5"
  //                 }`}
  //               />

  //               {/* Middle Line (Fades out when menu is open) */}
  //               <span
  //                 className={`h-[1.5px] bg-white transition-all duration-500 ${
  //                   isMenu ? "opacity-0 w-0" : "w-5 group-hover:w-8"
  //                 }`}
  //               />

  //               {/* Bottom Line */}
  //               <span
  //                 className={`h-[1.5px] bg-white transition-all duration-500 ease-in-out ${
  //                   isMenu
  //                     ? "w-8 rotate-45 -translate-y-[8px]"
  //                     : "w-8 group-hover:w-6"
  //                 }`}
  //               />
  //             </div>

  //             {/* Optional Label (Hidden on smallest screens) */}
  //             <span
  //               className={`ml-3 hidden sm:block text-[9px] font-black uppercase tracking-[0.4em] text-white transition-opacity duration-300 ${isMenu ? "opacity-0" : "opacity-60"}`}
  //             >
  //               Menu
  //             </span>
  //           </button>
  //         </div>
  //       </div>
  //       <div className="hidden lg:flex items-center justify-between w-full">
  //         <Link
  //           to="/"
  //           className="flex-shrink-0 flex items-center h-full transition-all duration-700 ease-in-out hover:scale-105"
  //         >
  //           {/* 'h-full' and 'flex items-center' on the Link ensure 
  //   the logo is centered relative to the navbar's height.
  // */}
  //           <img
  //             src={logo}
  //             className="w-28 sm:w-32 lg:w-40 brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
  //             alt="Range of Himalayas"
  //           />
  //         </Link>
  //         <nav className="flex items-center justify-center gap-6 lg:gap-10 flex-1 h-full px-4">
  //           {[
  //             { name: "Home", path: "/" },
  //             { name: "Our Story", path: "/about-us" },
  //             { name: "Create Box", path: "/custombox" },
  //             { name: "Journal", path: "/blog" },
  //             { name: "Contact", path: "/contact-us" },
  //           ].map((link) => (
  //             <Link
  //               key={link.name}
  //               to={link.path}
  //               className="relative group flex items-center h-full"
  //             >
  //               {/* The Text: Optimized for the Editorial look */}
  //               <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.4em] text-white/70 group-hover:text-white transition-all duration-500 whitespace-nowrap">
  //                 {link.name}
  //               </span>

  //               {/* The Harvest Dot: Centered below the text */}
  //               <span className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#B23A2E] rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out" />
  //             </Link>
  //           ))}
  //         </nav>
  //         <div className="flex mb-2 items-center gap-3 lg:gap-6">
  //           <div className="relative group flex items-center min-w-[160px] max-w-[240px] ml-6 h-full">
  //             {/* The Search Input */}
  //             <input
  //               placeholder="SEARCH HARVEST..."
  //               value={searchTerm}
  //               onChange={(e) => setSearchTerm(e.target.value)}
  //               onKeyDown={handleKeyDown}
  //               className="w-full pl-4 pr-10 py-1.5 rounded-full 
  //              bg-white/10 backdrop-blur-md border border-white/10
  //              text-[10px] tracking-[0.2em] text-white placeholder-white/40
  //              focus:outline-none focus:bg-white/20 focus:border-white/30 
  //              transition-all duration-700 ease-in-out"
  //             />

  //             {/* The Icon: Centered perfectly using top-1/2 and translate */}
  //             <CiSearch
  //               className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-xl 
  //              cursor-pointer opacity-60 group-hover:opacity-100 
  //              transition-opacity duration-500"
  //               onClick={handleSearch}
  //             />
  //           </div>

  //           {!user && (
  //             <Link to="/login" className="flex items-center h-full">
  //               <button className="relative group px-5 py-1.5 border border-white/30 rounded-none overflow-hidden transition-all duration-500 hover:border-white">
  //                 {/* 1. THE TEXT: Ultra-refined and wide-tracked */}
  //                 <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] text-white transition-colors duration-500">
  //                   Login
  //                 </span>

  //                 {/* 2. THE HOVER SLIDE: A subtle "ink" fill effect */}
  //                 <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />

  //                 {/* 3. TEXT SWAP ON HOVER: Black text when the white background slides up */}
  //                 <span className="absolute inset-0 z-20 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.4em] text-[#2d3a2d] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
  //                   Login
  //                 </span>
  //               </button>
  //             </Link>
  //           )}
  //           <div className="relative flex items-center h-full ml-4 lg:ml-6">
  //             <Link to="/wishlist" className="group relative p-2 outline-none">
  //               {/* 1. THE ICON: Thin stroke and consistent height */}
  //               <Heart
  //                 strokeWidth={1.5}
  //                 className="w-5 h-5 text-white transition-all duration-500 group-hover:scale-110 group-hover:text-[#B23A2E]"
  //               />

  //               {/* 2. THE BADGE: Smaller, centered, and matching the Harvest Red dot */}
  //               {wishListCount > 0 && (
  //                 <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center bg-[#B23A2E] text-[8px] font-black text-white rounded-full ring-2 ring-stone-900 transition-transform duration-500 group-hover:scale-125">
  //                   {wishListCount}
  //                 </span>
  //               )}

  //               {/* 3. SUBTLE UNDERGLOW: Makes the white icon pop against the orchard background */}
  //               <div className="absolute inset-0 bg-white/5 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
  //             </Link>
  //           </div>

  //           <Sheet open={openCart} onOpenChange={setOpenCart}>
  //             <div className="relative flex items-center h-full">
  //               <Sheet open={openCart} onOpenChange={setOpenCart}>
  //                 <div
  //                   className="group relative p-2 cursor-pointer outline-none"
  //                   onClick={() => setOpenCart(true)}
  //                 >
  //                   {/* 1. THE ICON: Switching to a sleeker bag/basket icon for a boutique feel */}
  //                   <svg
  //                     xmlns="http://www.w3.org/2000/svg"
  //                     width="20"
  //                     height="20"
  //                     viewBox="0 0 24 24"
  //                     fill="none"
  //                     stroke="white"
  //                     strokeWidth="1.5"
  //                     strokeLinecap="round"
  //                     strokeLinejoin="round"
  //                     className="transition-all duration-500 group-hover:scale-110 group-hover:text-[#B23A2E]"
  //                   >
  //                     <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
  //                     <path d="M3 6h18" />
  //                     <path d="M16 10a4 4 0 0 1-8 0" />
  //                   </svg>

  //                   {/* 2. THE BADGE: Using the Harvest Red + Ring for depth */}
  //                   {totalCount > 0 && (
  //                     <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center bg-[#B23A2E] text-[8px] font-black text-white rounded-full ring-2 ring-stone-900 transition-transform duration-500 group-hover:scale-125">
  //                       {totalCount}
  //                     </span>
  //                   )}
  //                 </div>

  //                 {/* 3. THE SHEET: Styled for the 'Archive' feel */}
  //                 <SheetContent
  //                   side="right"
  //                   className="sm:max-w-md bg-[#fdfcf7] border-l border-stone-200 p-0 shadow-2xl"
  //                 >
  //                   {/* UserCartWrapper will handle the internal styling */}
  //                   <UserCartWrapper
  //                     cartItems={cartItems}
  //                     setOpenCartSheet={setOpenCart}
  //                   />
  //                 </SheetContent>
  //               </Sheet>
  //             </div>
  //           </Sheet>
  //           <DropdownMenu>
  //             <DropdownMenuTrigger asChild>
  //               <div className="flex items-center justify-center h-full ml-2">
  //                 <div className="relative group cursor-pointer outline-none">
  //                   {/* 1. DECORATIVE OUTER RING: Mimics a wax seal or frame */}
  //                   <div className="absolute -inset-1 border border-white/5 rounded-full group-hover:border-[#B23A2E]/40 transition-colors duration-700" />

  //                   {/* 2. THE AVATAR: Perfectly centered */}
  //                   <Avatar className="h-8 w-8 lg:h-9 lg:w-9 ring-2 ring-stone-900 group-hover:ring-[#B23A2E] transition-all duration-500 shadow-2xl">
  //                     <AvatarImage
  //                       src={
  //                         user?.profile?.profilePhoto ||
  //                         "https://github.com/shadcn.png"
  //                       }
  //                       className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
  //                     />
  //                     {/* Fallback for when no image exists, using your brand colors */}
  //                     <AvatarFallback className="bg-[#2d3a2d] text-[#fdfcf7] text-[10px] font-serif italic">
  //                       {user?.name?.charAt(0) || "PH"}
  //                     </AvatarFallback>
  //                   </Avatar>

  //                   {/* 3. STATUS INDICATOR: A tiny red dot to match your hero icons */}
  //                   <span className="absolute bottom-0 right-0 h-2 w-2 bg-[#B23A2E] border border-stone-900 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
  //                 </div>
  //               </div>
  //             </DropdownMenuTrigger>
  //             <DropdownMenuContent className="w-56 p-2 mr-6 mt-2 shadow-lg rounded-xl">
  //               <DropdownMenuGroup className="p-2 space-y-1">
  //                 {user ? (
  //                   <>
  //                     {/* 1. SECTION LABEL */}
  //                     <div className="px-3 py-2 mb-1">
  //                       <p className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400">
  //                         The Explorer
  //                       </p>
  //                       <p className="text-[11px] font-serif italic text-stone-800 truncate">
  //                         {user?.name || "Member"}
  //                       </p>
  //                     </div>

  //                     {/* 2. NAVIGATION LINKS */}
  //                     <Link to="/profile">
  //                       <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 cursor-pointer outline-none transition-colors rounded-none hover:bg-stone-100 focus:bg-stone-100 group">
  //                         <User className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#B23A2E] transition-colors" />
  //                         <span className="text-[10px] font-bold uppercase tracking-widest text-stone-700">
  //                           Profile Archive
  //                         </span>
  //                       </DropdownMenuItem>
  //                     </Link>

  //                     <Link to="/account">
  //                       <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 cursor-pointer outline-none transition-colors rounded-none hover:bg-stone-100 focus:bg-stone-100 group">
  //                         <Settings className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#B23A2E] transition-colors" />
  //                         <span className="text-[10px] font-bold uppercase tracking-widest text-stone-700">
  //                           Account Settings
  //                         </span>
  //                       </DropdownMenuItem>
  //                     </Link>

  //                     {/* 3. TRACK ORDER: Re-styled as an editorial link instead of a heavy button */}
  //                     <DropdownMenuItem
  //                       onClick={() => navigate("/order-tracking")}
  //                       className="flex items-center justify-between px-3 py-3 mt-2 cursor-pointer outline-none bg-[#2d3a2d] text-white hover:bg-stone-800 transition-all rounded-sm"
  //                     >
  //                       <span className="text-[9px] font-black uppercase tracking-[0.2em]">
  //                         Track Your Harvest
  //                       </span>
  //                       <ArrowRight className="w-3 h-3 opacity-50" />
  //                     </DropdownMenuItem>

  //                     <div className="h-[1px] bg-stone-100 my-2 mx-2" />

  //                     {/* 4. LOGOUT */}
  //                     <DropdownMenuItem
  //                       onClick={handleLogout}
  //                       className="flex items-center gap-3 px-3 py-2.5 cursor-pointer outline-none group hover:bg-red-50 rounded-none"
  //                     >
  //                       <LogOut className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#B23A2E] transition-colors" />
  //                       <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 group-hover:text-[#B23A2E]">
  //                         Exit Ledger
  //                       </span>
  //                     </DropdownMenuItem>
  //                   </>
  //                 ) : (
  //                   <Link to="/login">
  //                     <DropdownMenuItem className="flex items-center justify-center gap-3 px-3 py-4 cursor-pointer outline-none bg-[#2d3a2d] text-white hover:bg-stone-900 transition-colors">
  //                       <span className="text-[10px] font-black uppercase tracking-[0.4em]">
  //                         Member Login
  //                       </span>
  //                     </DropdownMenuItem>
  //                   </Link>
  //                 )}
  //               </DropdownMenuGroup>
  //             </DropdownMenuContent>
  //           </DropdownMenu>
  //         </div>
  //       </div>
  //     </div>
  //     {isMenu && (
  //       <div className="fixed inset-0 z-[100] lg:hidden">
  //         {/* 1. BLUR OVERLAY: Dims the orchard background when menu is open */}
  //         <div
  //           className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
  //           onClick={toggleMenu}
  //         />

  //         {/* 2. THE SIDEBAR: Deep Forest Green with sharp editorial lines */}
  //         <div className="absolute top-0 right-0 h-full w-[280px] sm:w-[320px] bg-[#1a241a] shadow-2xl p-8 flex flex-col transition-all duration-500 ease-in-out">
  //           {/* HEADER: Close button with label */}
  //           <div className="flex justify-between items-center mb-12">
  //             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
  //               Navigation
  //             </span>
  //             <button onClick={toggleMenu} className="group p-2">
  //               <FaTimes className="text-xl text-white/60 group-hover:text-[#B23A2E] group-hover:rotate-90 transition-all duration-500" />
  //             </button>
  //           </div>

  //           {/* 3. NAVIGATION LINKS: Elegant and Spaced */}
  //           <nav className="flex flex-col gap-8">
  //             {[
  //               { name: "Home", path: "/" },
  //               { name: "Our Story", path: "/about-us" },
  //               { name: "Create Box", path: "/custombox" },
  //               { name: "Journal", path: "/blog" },
  //               { name: "Contact", path: "/contact-us" },
  //             ].map((link, index) => (
  //               <Link
  //                 key={link.name}
  //                 to={link.path}
  //                 onClick={toggleMenu}
  //                 className="group flex flex-col gap-1"
  //               >
  //                 <div className="flex items-center justify-between">
  //                   <span className="text-[13px] font-black uppercase tracking-[0.5em] text-white/80 group-hover:text-white transition-colors">
  //                     {link.name}
  //                   </span>
  //                   <span className="text-[10px] font-serif italic text-white/20 group-hover:text-[#B23A2E] transition-colors">
  //                     0{index + 1}
  //                   </span>
  //                 </div>
  //                 {/* Fine line separator below each link */}
  //                 <div className="h-[1px] w-full bg-white/5 group-hover:bg-[#B23A2E]/40 transition-colors duration-500" />
  //               </Link>
  //             ))}
  //           </nav>

  //           {/* 4. FOOTER: Member Login / Logout */}
  //           <div className="mt-auto pt-10">
  //             {!user ? (
  //               <Link to="/login" onClick={toggleMenu}>
  //                 <button className="w-full border border-white/20 py-4 text-[11px] font-black uppercase tracking-[0.4em] text-white hover:bg-white hover:text-[#1a241a] transition-all duration-500">
  //                   Member Login
  //                 </button>
  //               </Link>
  //             ) : (
  //               <button
  //                 onClick={() => {
  //                   handleLogout();
  //                   toggleMenu();
  //                 }}
  //                 className="w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors"
  //               >
  //                 Exit Archive
  //               </button>
  //             )}

  //             <p className="text-center mt-8 text-[9px] font-black uppercase tracking-[0.5em] text-white/20">
  //               Purely Himalayan © 2026
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </motion.nav>
  <motion.nav
  variants={{
    visible: { y: 0 },
    hidden: { y: "-100%" },
  }}
  animate={hidden ? "hidden" : "visible"}
  transition={{ duration: 0.35, ease: "easeInOut" }}
  className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-6 lg:px-10 min-h-16 md:h-20 flex items-center transition-all duration-300 ${
    scrolled ? "bg-[#F08C7D]/95 backdrop-blur-md shadow-md" : "bg-[#F08C7D]"
  }`}
>
  <div className="flex items-center justify-between w-full">
    {/* --- MOBILE & TABLET LAYOUT (hidden on lg) --- */}
    <div className="flex items-center justify-between w-full lg:hidden">
      <Link to="/" className="group relative flex items-center py-4 transition-all duration-500">
        <div className="absolute inset-0 bg-stone-200/20 blur-2xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700" />
        <img
          src={logo}
          alt="Logo"
          className="relative z-10 w-24 sm:w-32 h-auto object-contain brightness-90 group-hover:brightness-110 group-hover:scale-105 transition-all duration-700"
        />
      </Link>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Wishlist Mobile */}
        <Link to="/wishlist" className="relative p-2 group">
          <Heart strokeWidth={1.5} className="w-5 h-5 text-white group-hover:text-[#B23A2E] transition-colors" />
          {wishListCount > 0 && (
            <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center bg-[#B23A2E] text-[8px] font-black text-white rounded-full ring-2 ring-[#F08C7D]">
              {wishListCount}
            </span>
          )}
        </Link>

        {/* Cart Mobile */}
        <div onClick={() => setOpenCart(true)} className="relative p-2 cursor-pointer group">
          <ShoppingBag strokeWidth={1.5} className="w-5 h-5 text-white group-hover:text-[#B23A2E] transition-colors" />
          {totalCount > 0 && (
            <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center bg-[#B23A2E] text-[8px] font-black text-white rounded-full ring-2 ring-[#F08C7D]">
              {totalCount}
            </span>
          )}
        </div>

        {/* Hamburger */}
        <button onClick={toggleMenu} className="p-2 flex flex-col items-end gap-1.5 z-[110]">
          <span className={`h-[1.5px] bg-white transition-all duration-300 ${isMenu ? "w-7 -rotate-45 translate-y-[7.5px]" : "w-7"}`} />
          <span className={`h-[1.5px] bg-white transition-all duration-300 ${isMenu ? "opacity-0" : "w-5"}`} />
          <span className={`h-[1.5px] bg-white transition-all duration-300 ${isMenu ? "w-7 rotate-45 -translate-y-[7.5px]" : "w-7"}`} />
        </button>
      </div>
    </div>

    {/* --- DESKTOP LAYOUT (hidden below lg) --- */}
    <div className="hidden lg:flex items-center justify-between w-full">
      <Link to="/" className="flex-shrink-0 transition-transform duration-500 hover:scale-105">
        <img src={logo} className="w-36 lg:w-44 brightness-0 invert opacity-90 hover:opacity-100 transition-opacity" alt="Logo" />
      </Link>

      {/* Primary Desktop Nav */}
      <nav className="flex items-center justify-center gap-8 xl:gap-12 flex-1">
        {[
          { name: "Home", path: "/" },
          { name: "Our Story", path: "/about-us" },
          { name: "Create Box", path: "/custombox" },
          { name: "Journal", path: "/blog" },
          { name: "Contact", path: "/contact-us" },
        ].map((link) => (
          <Link key={link.name} to={link.path} className="relative group py-2">
            <span className="text-[10px] xl:text-[11px] font-black uppercase tracking-[0.3em] text-white/80 group-hover:text-white transition-colors">
              {link.name}
            </span>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#B23A2E] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4 xl:gap-6">
        {/* Search Bar */}
        <div className="relative group hidden xl:block">
          <input
            placeholder="SEARCH HARVEST..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-48 pl-4 pr-10 py-1.5 rounded-full bg-white/10 border border-white/10 text-[9px] tracking-widest text-white placeholder-white/40 focus:outline-none focus:bg-white/20 transition-all"
          />
          <CiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-white opacity-60 group-hover:opacity-100 cursor-pointer" onClick={handleSearch} />
        </div>

        {/* Desktop Icons */}
        <div className="flex items-center gap-3">
          <Link to="/wishlist" className="relative p-2 group">
            <Heart strokeWidth={1.5} className="w-5 h-5 text-white group-hover:text-[#B23A2E] transition-all" />
            {wishListCount > 0 && (
              <span className="absolute top-1 right-0 h-4 w-4 flex items-center justify-center bg-[#B23A2E] text-[8px] font-bold text-white rounded-full ring-2 ring-[#F08C7D]">
                {wishListCount}
              </span>
            )}
          </Link>

          <div onClick={() => setOpenCart(true)} className="relative p-2 cursor-pointer group">
            <ShoppingBag strokeWidth={1.5} className="w-5 h-5 text-white group-hover:text-[#B23A2E] transition-all" />
            {totalCount > 0 && (
              <span className="absolute top-1 right-0 h-4 w-4 flex items-center justify-center bg-[#B23A2E] text-[8px] font-bold text-white rounded-full ring-2 ring-[#F08C7D]">
                {totalCount}
              </span>
            )}
          </div>

          {/* User Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none ml-2">
              <div className="relative group p-0.5 border border-white/20 rounded-full hover:border-[#B23A2E]/50 transition-colors">
                <Avatar className="h-8 w-8 ring-2 ring-stone-900 shadow-xl">
                  <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} className="object-cover" />
                  <AvatarFallback className="bg-[#2d3a2d] text-white text-[10px] font-serif italic">
                    {user?.name?.charAt(0) || "PH"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-4 bg-[#fdfcf7] border-stone-200 rounded-none p-2 shadow-2xl">
              {user ? (
                <>
                  <div className="px-3 py-4 border-b border-stone-100 mb-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400">The Explorer</p>
                    <p className="font-serif italic text-stone-900 truncate">{user?.name}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate("/profile")} className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-stone-50">
                    <User className="w-4 h-4 text-stone-400" strokeWidth={1.5} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Profile Archive</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/order-tracking")} className="flex items-center gap-3 px-3 py-3 cursor-pointer bg-[#2d3a2d] text-white hover:bg-stone-800 mt-2">
                    <Package className="w-4 h-4" strokeWidth={1.5} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Track Harvest</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-red-50 text-red-600 mt-2">
                    <LogOut className="w-4 h-4" strokeWidth={1.5} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Exit Ledger</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => navigate("/login")} className="p-0">
                  <div className="w-full bg-[#2d3a2d] text-white py-4 text-center text-[10px] font-black uppercase tracking-[0.3em] hover:bg-stone-800 transition-colors">
                    Member Login
                  </div>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  </div>

  {/* --- GLOBAL SHEET FOR CART --- */}
  <Sheet open={openCart} onOpenChange={setOpenCart}>
    <SheetContent side="right" className="sm:max-w-md bg-[#fdfcf7] border-l border-stone-200 p-0 shadow-2xl">
      <UserCartWrapper cartItems={cartItems} setOpenCartSheet={setOpenCart} />
    </SheetContent>
  </Sheet>

  {/* --- MOBILE FULLSCREEN MENU --- */}
  <AnimatePresence>
    {isMenu && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] lg:hidden"
      >
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={toggleMenu} />
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute top-0 right-0 h-full w-[280px] sm:w-[320px] bg-[#1a241a] shadow-2xl p-8 flex flex-col"
        >
          <div className="flex justify-between items-center mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Navigation</span>
            <button onClick={toggleMenu} className="text-white/60 hover:text-[#B23A2E] transition-colors">
              <FaTimes size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-6">
            {[
              { name: "Home", path: "/" },
              { name: "Our Story", path: "/about-us" },
              { name: "Create Box", path: "/custombox" },
              { name: "Journal", path: "/blog" },
              { name: "Contact", path: "/contact-us" },
            ].map((link, idx) => (
              <Link key={link.name} to={link.path} onClick={toggleMenu} className="group py-2 border-b border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-white/80 group-hover:text-white">
                    {link.name}
                  </span>
                  <span className="text-[9px] font-serif italic text-white/20">0{idx + 1}</span>
                </div>
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            {!user ? (
              <Link to="/login" onClick={toggleMenu} className="block w-full border border-white/20 py-4 text-center text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-[#1a241a] transition-all">
                Member Login
              </Link>
            ) : (
              <button onClick={() => { handleLogout(); toggleMenu(); }} className="w-full py-4 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white">
                Exit Archive
              </button>
            )}
            <p className="text-center text-[8px] font-black uppercase tracking-widest text-white/20">
              Purely Himalayan © 2026
            </p>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
</motion.nav>
  );
}
