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
      className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-6 lg:px-10 min-h-16 md:h-20 transition-all duration-300
        ${
          scrolled
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
              <DropdownMenuContent className="w-56 mt-3 bg-[#fdfcf7] border-stone-200">
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
              </DropdownMenuContent>
            </DropdownMenu>

            {/* HAMBURGER MENU: Using a standard h-5/w-5 for consistency */}
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
      </div>
      {isMenu && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* 1. BLUR OVERLAY: Dims the orchard background when menu is open */}
          <div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={toggleMenu}
          />

          {/* 2. THE SIDEBAR: Deep Forest Green with sharp editorial lines */}
          <div className="absolute top-0 right-0 h-full w-[280px] sm:w-[320px] bg-[#1a241a] shadow-2xl p-8 flex flex-col transition-all duration-500 ease-in-out">
            {/* HEADER: Close button with label */}
            <div className="flex justify-between items-center mb-12">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                Navigation
              </span>
              <button onClick={toggleMenu} className="group p-2">
                <FaTimes className="text-xl text-white/60 group-hover:text-[#B23A2E] group-hover:rotate-90 transition-all duration-500" />
              </button>
            </div>

            {/* 3. NAVIGATION LINKS: Elegant and Spaced */}
            <nav className="flex flex-col gap-8">
              {[
                { name: "Home", path: "/" },
                { name: "Our Story", path: "/about-us" },
                { name: "Create Box", path: "/custombox" },
                { name: "Journal", path: "/blog" },
                { name: "Contact", path: "/contact-us" },
              ].map((link, index) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={toggleMenu}
                  className="group flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-black uppercase tracking-[0.5em] text-white/80 group-hover:text-white transition-colors">
                      {link.name}
                    </span>
                    <span className="text-[10px] font-serif italic text-white/20 group-hover:text-[#B23A2E] transition-colors">
                      0{index + 1}
                    </span>
                  </div>
                  {/* Fine line separator below each link */}
                  <div className="h-[1px] w-full bg-white/5 group-hover:bg-[#B23A2E]/40 transition-colors duration-500" />
                </Link>
              ))}
            </nav>

            {/* 4. FOOTER: Member Login / Logout */}
            <div className="mt-auto pt-10">
              {!user ? (
                <Link to="/login" onClick={toggleMenu}>
                  <button className="w-full border border-white/20 py-4 text-[11px] font-black uppercase tracking-[0.4em] text-white hover:bg-white hover:text-[#1a241a] transition-all duration-500">
                    Member Login
                  </button>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors"
                >
                  Exit Archive
                </button>
              )}

              <p className="text-center mt-8 text-[9px] font-black uppercase tracking-[0.5em] text-white/20">
                Purely Himalayan © 2026
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  );
}
