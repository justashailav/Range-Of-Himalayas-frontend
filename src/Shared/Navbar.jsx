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
    <motion.nav
  variants={{
    visible: { y: 0 },
    hidden: { y: "-100%" },
  }}
  animate={hidden ? "hidden" : "visible"}
  transition={{ duration: 0.35, ease: "easeInOut" }}
  className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-6 lg:px-10 h-16 md:h-20 transition-all duration-300 flex items-center
    ${
      scrolled
        ? "bg-[#F08C7D]/95 backdrop-blur-md shadow-md"
        : "bg-[#F08C7D]"
    }
  `}
>
  <div className="w-full max-w-[1920px] mx-auto">
    {/* --- MOBILE & TABLET LAYOUT (lg:hidden) --- */}
    <div className="flex lg:hidden items-center justify-between w-full">
      <Link to="/" className="flex-shrink-0">
        <img src={logo} alt="Logo" className="w-24 sm:w-28 brightness-0 invert" />
      </Link>

      <div className="flex items-center gap-4">
        {/* Wishlist Mobile */}
        <Link to="/wishlist" className="relative p-2">
          <Heart strokeWidth={1.5} className="w-5 h-5 text-white" />
          {wishListCount > 0 && (
            <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center bg-[#B23A2E] text-[7px] font-black text-white rounded-full">
              {wishListCount}
            </span>
          )}
        </Link>
        
        {/* Hamburger Menu Toggle */}
        <button onClick={toggleMenu} className="p-2 outline-none">
          <div className="flex flex-col items-end gap-1.5 group">
            <span className={`h-[1.5px] bg-white transition-all duration-500 ${isMenu ? "w-7 -rotate-45 translate-y-[7.5px]" : "w-7"}`} />
            <span className={`h-[1.5px] bg-white transition-all duration-500 ${isMenu ? "opacity-0" : "w-5"}`} />
            <span className={`h-[1.5px] bg-white transition-all duration-500 ${isMenu ? "w-7 rotate-45 -translate-y-[7.5px]" : "w-7"}`} />
          </div>
        </button>
      </div>
    </div>

    {/* --- DESKTOP LAYOUT (hidden lg:grid) --- */}
    {/* We use a grid here to ensure the center Nav is perfectly centered regardless of logo width */}
    <div className="hidden lg:grid grid-cols-12 items-center w-full">
      
      {/* 1. LOGO SECTION (Col 1-3) */}
      <div className="col-span-3 flex items-center">
        <Link to="/" className="group transition-transform duration-500 hover:scale-105">
          <img
            src={logo}
            alt="Range of Himalayas"
            className="w-32 xl:w-40 brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
          />
        </Link>
      </div>

      {/* 2. NAVIGATION LINKS (Col 4-9) - CENTERED */}
      <div className="col-span-6 flex justify-center items-center gap-8 xl:gap-12">
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
            className="relative group py-2"
          >
            <span className="text-[10px] xl:text-[11px] font-black uppercase tracking-[0.3em] text-white/80 group-hover:text-white transition-all duration-500">
              {link.name}
            </span>
            {/* The Animated "Harvest Dot" */}
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#B23A2E] rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500" />
          </Link>
        ))}
      </div>

      {/* 3. SEARCH & UTILITY (Col 10-12) - RIGHT ALIGNED */}
      <div className="col-span-3 flex items-center justify-end gap-5">
        
        {/* Search Bar */}
        <div className="relative group hidden xl:block">
          <input
            placeholder="SEARCH HARVEST..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-40 xl:w-48 pl-4 pr-10 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[9px] tracking-[0.2em] text-white placeholder-white/40 focus:outline-none focus:bg-white/20 focus:w-56 transition-all duration-700"
          />
          <CiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-lg opacity-60 group-hover:opacity-100" />
        </div>

        {/* Login/Account */}
        {!user ? (
          <Link to="/login">
            <button className="px-5 py-1.5 border border-white/30 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-white hover:text-[#2d3a2d] transition-all duration-500">
              Login
            </button>
          </Link>
        ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="h-8 w-8 ring-2 ring-white/10 hover:ring-[#B23A2E] transition-all">
                  <AvatarImage src={user?.profile?.profilePhoto} />
                  <AvatarFallback className="bg-stone-800 text-white text-[10px]">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#fdfcf7] border-none shadow-2xl rounded-none w-48">
                 {/* ... (Keep your existing DropdownMenuContent items here) */}
              </DropdownMenuContent>
            </DropdownMenu>
        )}

        {/* Wishlist */}
        <Link to="/wishlist" className="group relative p-1.5">
          <Heart strokeWidth={1.5} className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
          {wishListCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-[#B23A2E] text-[8px] font-black text-white rounded-full">
              {wishListCount}
            </span>
          )}
        </Link>

        {/* Cart Bag */}
        <div className="group relative p-1.5 cursor-pointer" onClick={() => setOpenCart(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-[#B23A2E] transition-colors">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {totalCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-[#B23A2E] text-[8px] font-black text-white rounded-full">
              {totalCount}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
</motion.nav>
  );
}
