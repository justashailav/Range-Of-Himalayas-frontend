import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaTimes, FaShoppingCart } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-himalayas.png";
import UserCartWrapper from "@/components/Cart-wrapper";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, LogOut, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { searchProducts } from "@/store/slices/searchSlice";
import { Button } from "@/components/ui/button";
import { resetAuthSlice } from "@/store/slices/authSlice";
import { persistor } from "@/store/store";
import { useScroll,motion,useMotionValueEvent } from "framer-motion";

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
    visible: { y: 0, opacity: 1 },
    hidden: { y: "-100%", opacity: 0 },
  }}
  animate={hidden ? "hidden" : "visible"}
  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // Smoother cubic-bezier
  className={`fixed top-0 left-0 w-full z-50 px-6 lg:px-12 transition-all duration-500
    ${
      scrolled
        ? "py-3 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100" 
        : "py-5 bg-transparent"
    }
  `}
>
  <div className="flex items-center justify-between max-w-7xl mx-auto">
    
    {/* --- LOGO SECTION --- */}
    <Link to="/" className="hover:scale-105 transition-transform duration-300">
      <img 
        src={logo} 
        className={`transition-all duration-300 ${scrolled ? "w-24 md:w-28" : "w-28 md:w-36"}`} 
        alt="Range of Himalayas" 
      />
    </Link>

    {/* --- DESKTOP NAVIGATION (LG+) --- */}
    <div className={`hidden lg:flex items-center gap-8 font-bold tracking-widest text-[13px] transition-colors duration-300
      ${scrolled ? "text-slate-800" : "text-white"}`}>
      {['HOME', 'OUR STORY', 'CREATE BOX', 'BLOG', 'CONTACT US'].map((item) => (
        <Link 
          key={item} 
          to={`/${item.toLowerCase().replace(' ', '-')}`}
          className="relative group overflow-hidden"
        >
          {item === 'HOME' ? <Link to="/">HOME</Link> : item}
          <span className={`absolute bottom-0 left-0 w-full h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${scrolled ? "bg-[#F08C7D]" : "bg-white"}`} />
        </Link>
      ))}
    </div>

    {/* --- ACTION ICONS & SEARCH --- */}
    <div className="flex items-center gap-4 md:gap-6">
      
      {/* Search Bar - Desktop */}
      <div className="hidden md:relative md:block group">
        <CiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 text-2xl transition-colors ${scrolled ? "text-slate-500" : "text-white"}`} />
        <input
          placeholder="Search purity..."
          className={`pl-10 pr-4 py-2 rounded-full border-none text-sm transition-all duration-300 w-40 focus:w-64
            ${scrolled ? "bg-slate-100 text-slate-800" : "bg-white/20 backdrop-blur-md text-white placeholder-white/70"}`}
        />
      </div>

      {/* Icons Section */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Wishlist */}
        <Link to="/wishlist" className="relative group">
          <Heart className={`w-6 h-6 transition-colors ${scrolled ? "text-slate-700" : "text-white"}`} />
          {wishListCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
              {wishListCount}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Sheet open={openCart} onOpenChange={setOpenCart}>
          <div className="relative cursor-pointer group" onClick={() => setOpenCart(true)}>
            <FaShoppingCart className={`text-xl transition-colors ${scrolled ? "text-slate-700" : "text-white"}`} />
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#F08C7D] text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </div>
          <SheetContent side="right" className="w-full sm:max-w-md border-l-0 shadow-2xl">
            <UserCartWrapper cartItems={cartItems} setOpenCartSheet={setOpenCart} />
          </SheetContent>
        </Sheet>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none focus:outline-none">
            <Avatar className={`h-9 w-9 border-2 transition-colors ${scrolled ? "border-[#F08C7D]" : "border-white/50"}`}>
              <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-4 rounded-2xl shadow-xl border-slate-100 p-2">
            {user ? (
              <>
                <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">My Account</div>
                <Link to="/profile"><DropdownMenuItem className="cursor-pointer rounded-lg">Profile</DropdownMenuItem></Link>
                <Link to="/order-tracking"><DropdownMenuItem className="cursor-pointer rounded-lg text-green-600 font-bold">Track Order</DropdownMenuItem></Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer rounded-lg">Logout</DropdownMenuItem>
              </>
            ) : (
              <Link to="/login"><DropdownMenuItem className="font-bold">Login / Register</DropdownMenuItem></Link>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile Toggle */}
        <div className="lg:hidden ml-2" onClick={toggleMenu}>
          {isMenu ? (
            <FaTimes className={`text-2xl ${scrolled ? "text-slate-800" : "text-white"}`} />
          ) : (
            <GiHamburgerMenu className={`text-2xl ${scrolled ? "text-slate-800" : "text-white"}`} />
          )}
        </div>
      </div>
    </div>
  </div>

  {/* --- MOBILE SIDEBAR OVERLAY --- */}
  <AnimatePresence>
    {isMenu && (
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-screen w-[80%] max-w-xs bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-[60] flex flex-col p-8 lg:hidden"
      >
        <div className="flex justify-between items-center mb-12">
          <img src={logo} className="w-24 filter brightness-0 opacity-80" alt="Logo" />
          <FaTimes className="text-2xl text-slate-400" onClick={toggleMenu} />
        </div>
        <div className="flex flex-col gap-6 text-slate-800 font-black text-xl tracking-tight">
          {['HOME', 'OUR STORY', 'CREATE BOX', 'BLOG', 'CONTACT US'].map((item) => (
            <Link key={item} to={`/${item.toLowerCase().replace(' ', '-')}`} onClick={toggleMenu} className="hover:text-[#F08C7D] transition-colors uppercase">
              {item}
            </Link>
          ))}
        </div>
        <div className="mt-auto pt-10 border-t border-slate-100">
           {!user && (
             <Link to="/login" onClick={toggleMenu}>
               <button className="w-full bg-[#F08C7D] text-white py-4 rounded-2xl font-black tracking-widest">LOGIN</button>
             </Link>
           )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</motion.nav>
  );
}
