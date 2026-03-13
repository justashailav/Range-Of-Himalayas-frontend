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
import { Heart, LogOut, Package, Settings, User } from "lucide-react";
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
      className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-6 lg:px-10 min-h-16 md:h-20 transition-all duration-300
        ${
          scrolled
            ? "bg-[#F08C7D]/95 backdrop-blur-md shadow-md"
            : "bg-[#F08C7D]"
        }
      `}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center justify-between w-full md:flex lg:hidden">
          <Link
            to="/"
            className="group relative flex items-center justify-center py-4 transition-all duration-500"
          >
            {/* Subtle "Light" glow behind logo on hover */}
            <div className="absolute inset-0 bg-stone-200/20 blur-2xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700" />

            <img
              src={logo}
              alt="Purely Himalayan Logo"
              className="relative z-10 w-24 sm:w-32 h-auto object-contain 
               brightness-90 group-hover:brightness-110 
               group-hover:scale-105 transition-all duration-700 
               ease-[cubic-bezier(0.23,1,0.32,1)]"
            />

            {/* The "Signature" underline that only appears on hover */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#B23A2E] group-hover:w-8 transition-all duration-500" />
          </Link>

          <div className="flex items-center gap-4 sm:gap-4 mt-2">
            <Sheet open={openCart} onOpenChange={setOpenCart}>
              <div className="relative group">
                <Link to="/wishlist" className="flex items-center gap-2">
                  {/* 1. THE ICON: Thin stroke for a delicate, artisanal feel */}
                  <div className="relative p-2 transition-transform duration-500 group-hover:scale-110">
                    <Heart
                      strokeWidth={1.5}
                      className="w-5 h-5 text-white transition-colors duration-500 group-hover:text-[#B23A2E]"
                    />

                    {/* 2. THE NOTIFICATION: Minimalist & Flat */}
                    {wishListCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center bg-[#B23A2E] text-[8px] font-black text-white rounded-full ring-2 ring-stone-900"
                      >
                        {wishListCount}
                      </motion.span>
                    )}
                  </div>

                  {/* 3. OPTIONAL LABEL: Only shows on larger screens for that "Journal" feel */}
                  <span className="hidden lg:block text-[9px] font-black uppercase tracking-[0.3em] text-white/60 group-hover:text-white transition-colors duration-500">
                    Saved Records
                  </span>
                </Link>

                {/* 4. UNDERLINE ACCENT: A thin red line that grows on hover */}
                <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#B23A2E] group-hover:w-full transition-all duration-700" />
              </div>

              <div className="relative group">
                <div
                  onClick={() => setOpenCart(true)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {/* 1. THE ICON: Switching to a sleeker 'ShoppingBag' for an artisanal boutique feel */}
                  <div className="relative p-2 transition-transform duration-500 group-hover:-translate-y-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-colors duration-500 group-hover:text-[#B23A2E]"
                    >
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                      <path d="M3 6h18" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>

                    {/* 2. THE COUNT: Refined and balanced */}
                    {totalCount > 0 && (
                      <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center bg-[#B23A2E] text-[8px] font-black text-white rounded-full ring-2 ring-stone-900"
                      >
                        {totalCount}
                      </motion.span>
                    )}
                  </div>

                  {/* 3. EDITORIAL LABEL: Adds to the Journal/Catalog aesthetic */}
                  <div className="hidden xl:flex flex-col items-start leading-none">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white group-hover:text-[#B23A2E] transition-colors duration-500">
                      Provisions
                    </span>
                    <span className="text-[7px] font-mono text-white/40 uppercase tracking-widest mt-1">
                      Your Selection
                    </span>
                  </div>
                </div>

                {/* 4. INTERACTION LINE */}
                <div className="absolute -bottom-1 right-0 w-0 h-[1px] bg-[#B23A2E] group-hover:w-full transition-all duration-700" />
              </div>
              <SheetContent side="right" className="sm:max-w-md">
                <UserCartWrapper
                  cartItems={cartItems}
                  setOpenCartSheet={setOpenCart}
                />
              </SheetContent>
            </Sheet>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative group cursor-pointer outline-none">
                  {/* 1. DECORATIVE OUTER RING (The "Seal") */}
                  <div className="absolute -inset-1 border border-white/10 rounded-full group-hover:border-[#B23A2E]/50 transition-colors duration-500" />

                  {/* 2. THE AVATAR CONTAINER */}
                  <Avatar className="h-9 w-9 sm:h-10 sm:w-10 ring-2 ring-stone-900 group-hover:ring-[#B23A2E] transition-all duration-500 shadow-2xl">
                    <AvatarImage
                      src={
                        user?.profile?.profilePhoto ||
                        "https://github.com/shadcn.png"
                      }
                      className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
                    />
                    {/* 3. CUSTOM FALLBACK (Initials in Journal Font) */}
                    <AvatarFallback className="bg-[#2d3a2d] text-[#fdfcf7] font-serif italic text-xs">
                      {user?.name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>

                  {/* 4. STATUS INDICATOR (Minimalist dot) */}
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-[#B23A2E] border-2 border-stone-900 rounded-full shadow-sm" />

                  {/* 5. HOVER LABEL (Optional, for that "Catalog" feel) */}
                  <div className="absolute top-full mt-4 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white whitespace-nowrap bg-stone-900 px-3 py-1 rounded-sm">
                      Account Ledger
                    </span>
                  </div>
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
              className="relative z-[100] p-2 flex items-center justify-center transition-all duration-300 active:scale-90"
              aria-label="Toggle Menu"
            >
              <div className="flex flex-col items-end gap-1.5 group">
                {/* Top Line */}
                <span
                  className={`h-[1.5px] bg-white transition-all duration-500 ease-in-out ${
                    isMenu
                      ? "w-8 -rotate-45 translate-y-[8px]"
                      : "w-8 group-hover:w-5"
                  }`}
                />

                {/* Middle Line (Fades out when menu is open) */}
                <span
                  className={`h-[1.5px] bg-white transition-all duration-500 ${
                    isMenu ? "opacity-0 w-0" : "w-5 group-hover:w-8"
                  }`}
                />

                {/* Bottom Line */}
                <span
                  className={`h-[1.5px] bg-white transition-all duration-500 ease-in-out ${
                    isMenu
                      ? "w-8 rotate-45 -translate-y-[8px]"
                      : "w-8 group-hover:w-6"
                  }`}
                />
              </div>

              {/* Optional Label (Hidden on smallest screens) */}
              <span
                className={`ml-3 hidden sm:block text-[9px] font-black uppercase tracking-[0.4em] text-white transition-opacity duration-300 ${isMenu ? "opacity-0" : "opacity-60"}`}
              >
                Menu
              </span>
            </button>
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-between w-full">
          <div className="flex items-center justify-between w-full px-10 py-6">
  {/* 1. THE LOGO: Pure white and centered vertically */}
  <Link
    to="/"
    className="flex-shrink-0 transition-transform duration-700 hover:scale-105"
  >
    <img
      src={logo}
      className="w-32 sm:w-36 lg:w-44 brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
      alt="Purely Himalayan Logo"
    />
  </Link>

  {/* 2. THE NAV LINKS: Wide tracking and Harvest Dot indicator */}
  <nav className="hidden md:flex items-center justify-center gap-10 lg:gap-16 flex-1">
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
        {/* Updated Typography: Smaller, wider tracking, more delicate opacity */}
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60 group-hover:text-white transition-all duration-500">
          {link.name}
        </span>

        {/* The Indicator: Replacing the line with the 'Harvest Dot' to match your hero icons */}
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#B23A2E] rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out" />
      </Link>
    ))}
  </nav>
</div>
          <div className="flex mb-2 items-center gap-3 lg:gap-6">
            <div className="relative flex-1 min-w-[150px] max-w-[250px] ml-6">
              <CiSearch
                className="absolute right-3 top-2 text-white text-2xl cursor-pointer"
                onClick={handleSearch}
              />
              <input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-2 pr-10 py-2 rounded-md border-none placeholder-white text-white
                           bg-white/20 backdrop-blur-sm"
              />
            </div>

            {!user && (
              <Link to="/login">
                <button className="border-[#F08C7D] font-semibold bg-[#F08C7D] text-white py-1 md:py-2 px-3 md:px-4 rounded-lg hover:bg-[#FFECE8] hover:text-[#F08C7D] transition duration-500 text-sm md:text-base">
                  LOGIN
                </button>
              </Link>
            )}

            <div className="relative">
              <Link to="/wishlist">
                <Heart color="white" className="cursor-pointer text-2xl" />
                {wishListCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                    {wishListCount}
                  </span>
                )}
              </Link>
            </div>

            <Sheet open={openCart} onOpenChange={setOpenCart}>
              <div className="relative">
                <FaShoppingCart
                  onClick={() => setOpenCart(true)}
                  className="text-white text-2xl cursor-pointer"
                />
                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                    {totalCount}
                  </span>
                )}
              </div>
              <SheetContent side="right" className="sm:max-w-md">
                <UserCartWrapper
                  cartItems={cartItems}
                  setOpenCartSheet={setOpenCart}
                />
              </SheetContent>
            </Sheet>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer ring-2 ring-gray-300 transition">
                  <AvatarImage
                    src={
                      user?.profile?.profilePhoto ||
                      "https://github.com/shadcn.png"
                    }
                  />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 p-2 mr-6 mt-2 shadow-lg rounded-xl">
                <DropdownMenuGroup>
                  {user ? (
                    <>
                      <Link to="/profile">
                        <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
                          <User className="w-4 h-4 text-muted-foreground" />
                          Profile
                        </DropdownMenuItem>
                      </Link>
                      <Link to="/account">
                        <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
                          <User className="w-4 h-4 text-muted-foreground" />
                          Account
                        </DropdownMenuItem>
                      </Link>
                      <div>
                        <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
                          <Button
                            onClick={() => navigate("/order-tracking")}
                            className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                          >
                            Track your order
                          </Button>
                        </DropdownMenuItem>
                      </div>

                      <DropdownMenuItem
                        className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 text-muted-foreground" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <Link to="/login">
                      <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
                        <User className="w-4 h-4 text-muted-foreground" />
                        Login
                      </DropdownMenuItem>
                    </Link>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {isMenu && (
        <div className="fixed top-0 right-0 h-full w-64 sm:w-72 md:w-80 lg:hidden bg-[#F08C7D] shadow-lg p-6 flex flex-col gap-5 text-white z-50 transition-transform transform translate-x-0">
          <div className="flex justify-end mb-2">
            <FaTimes
              className="text-2xl sm:text-3xl cursor-pointer hover:text-gray-200 transition"
              onClick={toggleMenu}
            />
          </div>

          <Link
            to="/"
            className="hover:text-gray-200 text-base sm:text-lg"
            onClick={toggleMenu}
          >
            HOME
          </Link>
          <Link
            to="/about-us"
            className="hover:text-gray-200 text-base sm:text-lg"
            onClick={toggleMenu}
          >
            OUR STORY
          </Link>
          <Link
            to="/custombox"
            className="hover:text-gray-200 text-base sm:text-lg"
            onClick={toggleMenu}
          >
            CREATE BOX
          </Link>

          <Link
            to="/blog"
            className="hover:text-gray-200 text-base sm:text-lg"
            onClick={toggleMenu}
          >
            BLOG
          </Link>
          <Link
            to="/contact-us"
            className="hover:text-gray-200 text-base sm:text-lg"
            onClick={toggleMenu}
          >
            CONTACT US
          </Link>
          {!user && (
            <Link to="/login">
              <button className="border-[#F08C7D] bg-[#FFECE8] text-[#F08C7D] py-2 px-4 rounded-md font-semibold mt-4 hover:bg-[#F08C7D] hover:text-white transition">
                LOGIN
              </button>
            </Link>
          )}
        </div>
      )}
    </motion.nav>
  );
}
