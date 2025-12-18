// import React, { useState } from "react";
// import { GiHamburgerMenu } from "react-icons/gi";
// import { FaTimes, FaShoppingCart } from "react-icons/fa";
// import { CiSearch } from "react-icons/ci";
// import { Link, useNavigate,useLocation } from "react-router-dom";
// import logo from "../assets/logo-himalayas.png";
// import UserCartWrapper from "@/components/Cart-wrapper";
// import { Sheet, SheetContent } from "@/components/ui/sheet";
// import { Avatar, AvatarImage } from "@/components/ui/avatar";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Heart, LogOut, User } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { searchProducts } from "@/store/slices/searchSlice";
// import { Button } from "@/components/ui/button";
// import { resetAuthSlice } from "@/store/slices/authSlice";
// import { persistor } from "@/store/store";
// import { useScroll,motion,useMotionValueEvent } from "framer-motion";

// export default function Navbar() {
//   const [isMenu, setIsMenu] = useState(false);
//   const [openCart, setOpenCart] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const { user } = useSelector((state) => state.auth);
//   const { cartItems, boxes } = useSelector((state) => state.cart);
//   const { wishListItems } = useSelector((state) => state.wishList);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   const { scrollY } = useScroll();
//   const [hidden, setHidden] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useMotionValueEvent(scrollY, "change", (latest) => {
//     const previous = scrollY.getPrevious();

//     if (latest > previous && latest > 80) {
//       setHidden(true); 
//     } else {
//       setHidden(false); 
//     }

//     setScrolled(latest > 20);
//   });
//   const toggleMenu = () => setIsMenu((prev) => !prev);

//   const handleSearch = () => {
//     if (searchTerm.trim().length > 2) {
//       dispatch(searchProducts(searchTerm.trim()));
//       navigate(`/search?keyword=${searchTerm.trim()}`);
//     }
//   };
//   const handleLogout = () => {
//     dispatch(resetAuthSlice());
//     persistor.purge();
//     navigate("/login");
//   };
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") handleSearch();
//   };
//   const cartCount =
//     cartItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
//   const boxCount = boxes?.length || 0;
//   const totalCount = cartCount + boxCount;
//   const wishListCount = wishListItems?.length || 0;

//   const NavItem = ({ to, label }) => {
//     const active = location.pathname === to;
//     return (
//       <Link to={to} className="relative px-1">
//         <span>{label}</span>
//         {active && (
//           <motion.span
//             layoutId="nav-underline"
//             className="absolute -bottom-1 left-0 h-[2px] w-full bg-white rounded"
//           />
//         )}
//       </Link>
//     );
//   };

//   return (
//     <motion.nav 
//       variants={{
//         visible: { y: 0 },
//         hidden: { y: "-100%" },
//       }}
//       animate={hidden ? "hidden" : "visible"}
//       transition={{ duration: 0.35, ease: "easeInOut" }}
//       className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-6 lg:px-10 min-h-16 md:h-20 transition-all duration-300
//         ${
//           scrolled
//             ? "bg-[#F08C7D]/95 backdrop-blur-md shadow-md"
//             : "bg-[#F08C7D]"
//         }
//       `}
//     >
//       <div className="flex items-center justify-between w-full">
//         <div className="flex items-center justify-between w-full md:flex lg:hidden">
//           <Link to="/">
//             <img src={logo} className="w-24 sm:w-28 mt-1" alt="Logo" />
//           </Link>

//           <div className="flex items-center gap-4 sm:gap-4 mt-2">
//             <Sheet open={openCart} onOpenChange={setOpenCart}>
//             <div className="relative">
//                <Link to="/wishlist">
//                 <Heart color="white" className="cursor-pointer text-2xl" />
//                 {wishListCount > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
//                     {wishListCount}
//                   </span>
//                 )}
//               </Link>
//             </div>

//               <div className="relative">
//                 <FaShoppingCart
//                   onClick={() => setOpenCart(true)}
//                   className="text-white text-2xl sm:text-3xl cursor-pointer hover:text-gray-200 transition"
//                 />
//                 {totalCount > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
//                     {totalCount}
//                   </span>
//                 )}
//               </div>
//               <SheetContent side="right" className="sm:max-w-md">
//                 <UserCartWrapper
//                   cartItems={cartItems}
//                   setOpenCartSheet={setOpenCart}
//                 />
//               </SheetContent>
//             </Sheet>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Avatar className="cursor-pointer ring-2 ring-gray-300 transition">
//                   <AvatarImage
//                     src={
//                       user?.profile?.profilePhoto ||
//                       "https://github.com/shadcn.png"
//                     }
//                   />
//                 </Avatar>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-56 p-2 mr-6 mt-2 shadow-lg rounded-xl">
//                 <DropdownMenuGroup>
//                   {user ? (
//                     <>
//                       <Link to="/profile">
//                         <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
//                           <User className="w-4 h-4 text-muted-foreground" />
//                           Profile
//                         </DropdownMenuItem>
//                       </Link>
//                       <Link to="/account">
//                         <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
//                           <User className="w-4 h-4 text-muted-foreground" />
//                           Account
//                         </DropdownMenuItem>
//                       </Link>
//                       <div>
//                         <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
//                           <Button
//                             onClick={() => navigate("/order-tracking")}
//                             className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
//                           >
//                             Track your order
//                           </Button>
//                         </DropdownMenuItem>
//                       </div>
//                       <DropdownMenuItem
//                         className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer"
//                         onClick={handleLogout}
//                       >
//                         <LogOut className="w-4 h-4 text-muted-foreground" />
//                         Logout
//                       </DropdownMenuItem>
//                     </>
//                   ) : (
//                     <Link to="/login">
//                       <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
//                         <User className="w-4 h-4 text-muted-foreground" />
//                         Login
//                       </DropdownMenuItem>
//                     </Link>
//                   )}
//                 </DropdownMenuGroup>
//               </DropdownMenuContent>
//             </DropdownMenu>

//             {isMenu ? (
//               <FaTimes
//                 className="text-2xl sm:text-3xl text-white cursor-pointer hover:text-gray-200 transition"
//                 onClick={toggleMenu}
//               />
//             ) : (
//               <GiHamburgerMenu
//                 className="text-2xl sm:text-3xl text-white cursor-pointer hover:text-gray-200 transition"
//                 onClick={toggleMenu}
//               />
//             )}
//           </div>
//         </div>
//         <div className="hidden lg:flex items-center justify-between w-full">
//           <Link to="/" className="flex-shrink-0 ">
//             <img src={logo} className="w-28 sm:w-32 lg:w-36" alt="Logo" />
//           </Link>
//           <div className="flex mb-2 gap-4 lg:gap-6 text-white font-bold text-base lg:text-lg flex-1 justify-center whitespace-nowrap">
//             <Link to="/">HOME</Link>
//             <Link to="/about-us">OUR STORY</Link>
//             <Link to="/custombox">CREATE BOX</Link>
//             <Link to="/blog">BLOG</Link>
//             <Link to="/contact-us">CONTACT US</Link>
//           </div>
//           <div className="flex mb-2 items-center gap-3 lg:gap-6">
//             <div className="relative flex-1 min-w-[150px] max-w-[250px] ml-6">
//               <CiSearch
//                 className="absolute right-3 top-2 text-white text-2xl cursor-pointer"
//                 onClick={handleSearch}
//               />
//               <input
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 className="w-full pl-2 pr-10 py-2 rounded-md border-none placeholder-white text-white
//                            bg-white/20 backdrop-blur-sm"
//               />
//             </div>

//             {!user && (
//               <Link to="/login">
//                 <button className="border-[#F08C7D] font-semibold bg-[#F08C7D] text-white py-1 md:py-2 px-3 md:px-4 rounded-lg hover:bg-[#FFECE8] hover:text-[#F08C7D] transition duration-500 text-sm md:text-base">
//                   LOGIN
//                 </button>
//               </Link>
//             )}

//             <div className="relative">
//               <Link to="/wishlist">
//                 <Heart color="white" className="cursor-pointer text-2xl" />
//                 {wishListCount > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
//                     {wishListCount}
//                   </span>
//                 )}
//               </Link>
//             </div>

//             <Sheet open={openCart} onOpenChange={setOpenCart}>
//               <div className="relative">
//                 <FaShoppingCart
//                   onClick={() => setOpenCart(true)}
//                   className="text-white text-2xl cursor-pointer"
//                 />
//                 {totalCount > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
//                     {totalCount}
//                   </span>
//                 )}
//               </div>
//               <SheetContent side="right" className="sm:max-w-md">
//                 <UserCartWrapper
//                   cartItems={cartItems}
//                   setOpenCartSheet={setOpenCart}
//                 />
//               </SheetContent>
//             </Sheet>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Avatar className="cursor-pointer ring-2 ring-gray-300 transition">
//                   <AvatarImage
//                     src={
//                       user?.profile?.profilePhoto ||
//                       "https://github.com/shadcn.png"
//                     }
//                   />
//                 </Avatar>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-56 p-2 mr-6 mt-2 shadow-lg rounded-xl">
//                 <DropdownMenuGroup>
//                   {user ? (
//                     <>
//                       <Link to="/profile">
//                         <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
//                           <User className="w-4 h-4 text-muted-foreground" />
//                           Profile
//                         </DropdownMenuItem>
//                       </Link>
//                       <Link to="/account">
//                         <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
//                           <User className="w-4 h-4 text-muted-foreground" />
//                           Account
//                         </DropdownMenuItem>
//                       </Link>
//                       <div>
//                         <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
//                           <Button
//                             onClick={() => navigate("/order-tracking")}
//                             className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
//                           >
//                             Track your order
//                           </Button>
//                         </DropdownMenuItem>
//                       </div>

//                       <DropdownMenuItem
//                         className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer"
//                         onClick={handleLogout}
//                       >
//                         <LogOut className="w-4 h-4 text-muted-foreground" />
//                         Logout
//                       </DropdownMenuItem>
//                     </>
//                   ) : (
//                     <Link to="/login">
//                       <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
//                         <User className="w-4 h-4 text-muted-foreground" />
//                         Login
//                       </DropdownMenuItem>
//                     </Link>
//                   )}
//                 </DropdownMenuGroup>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </div>
//       {isMenu && (
//         <div className="fixed top-0 right-0 h-full w-64 sm:w-72 md:w-80 lg:hidden bg-[#F08C7D] shadow-lg p-6 flex flex-col gap-5 text-white z-50 transition-transform transform translate-x-0">
//           <div className="flex justify-end mb-2">
//             <FaTimes
//               className="text-2xl sm:text-3xl cursor-pointer hover:text-gray-200 transition"
//               onClick={toggleMenu}
//             />
//           </div>

//           <Link
//             to="/"
//             className="hover:text-gray-200 text-base sm:text-lg"
//             onClick={toggleMenu}
//           >
//             HOME
//           </Link>
//           <Link
//             to="/about-us"
//             className="hover:text-gray-200 text-base sm:text-lg"
//             onClick={toggleMenu}
//           >
//             OUR STORY
//           </Link>
//           <Link
//             to="/custombox"
//             className="hover:text-gray-200 text-base sm:text-lg"
//             onClick={toggleMenu}
//           >
//             CREATE BOX
//           </Link>

//           <Link
//             to="/blog"
//             className="hover:text-gray-200 text-base sm:text-lg"
//             onClick={toggleMenu}
//           >
//             BLOG
//           </Link>
//           <Link
//             to="/contact-us"
//             className="hover:text-gray-200 text-base sm:text-lg"
//             onClick={toggleMenu}
//           >
//             CONTACT US
//           </Link>
//           {!user && (
//             <Link to="/login">
//               <button className="border-[#F08C7D] bg-[#FFECE8] text-[#F08C7D] py-2 px-4 rounded-md font-semibold mt-4 hover:bg-[#F08C7D] hover:text-white transition">
//                 LOGIN
//               </button>
//             </Link>
//           )}
//         </div>
//       )}
//     </motion.nav>
//   );
// }


import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaTimes, FaShoppingCart } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { motion, useScroll, useMotionValueEvent,AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMenu, setIsMenu] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { cartItems, boxes } = useSelector((state) => state.cart);
  const { wishListItems } = useSelector((state) => state.wishList);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  /* ---------------- NAVBAR SCROLL ---------------- */
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious();
    if (latest > prev && latest > 80) setHidden(true);
    else setHidden(false);
    setScrolled(latest > 20);
  });

  /* ---------------- HELPERS ---------------- */
  const handleSearch = () => {
    if (searchTerm.trim().length > 2) {
      dispatch(searchProducts(searchTerm.trim()));
      navigate(`/search?keyword=${searchTerm.trim()}`);
      setShowSearch(false);
    }
  };

  const handleLogout = () => {
    dispatch(resetAuthSlice());
    persistor.purge();
    navigate("/login");
  };

  const cartCount =
    cartItems?.reduce((s, i) => s + (i.quantity || 1), 0) || 0;
  const totalCount = cartCount + (boxes?.length || 0);

  /* ---------------- ACTIVE LINK ---------------- */
  const NavItem = ({ to, label }) => {
    const active = location.pathname === to;
    return (
      <Link to={to} className="relative px-1">
        <span>{label}</span>
        {active && (
          <motion.span
            layoutId="nav-underline"
            className="absolute -bottom-1 left-0 h-[2px] w-full bg-white rounded"
          />
        )}
      </Link>
    );
  };

  return (
    <motion.nav
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35 }}
      className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-6 lg:px-10 min-h-16 md:h-20
        ${scrolled ? "bg-[#F08C7D]/95 backdrop-blur-md shadow-md" : "bg-[#F08C7D]"}
      `}
    >
      <div className="flex items-center justify-between w-full">

        {/* LOGO */}
        <Link to="/">
          <motion.img
            src={logo}
            className="w-28"
            alt="Logo"
            whileHover={{ scale: 1.05 }}
          />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex gap-6 text-white font-bold">
          <NavItem to="/" label="HOME" />
          <NavItem to="/about-us" label="OUR STORY" />
          <NavItem to="/custombox" label="CREATE BOX" />
          <NavItem to="/blog" label="BLOG" />
          <NavItem to="/contact-us" label="CONTACT US" />
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-5">

          {/* SEARCH EXPAND */}
          <motion.div
            animate={{ width: showSearch ? 220 : 40 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden"
          >
            <CiSearch
              onClick={() => setShowSearch(true)}
              className="absolute right-2 top-2 text-white cursor-pointer"
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onBlur={() => setShowSearch(false)}
              placeholder="Search..."
              className="w-full bg-white/20 text-white placeholder-white px-2 py-1 pr-8 rounded"
            />
          </motion.div>

          {/* WISHLIST */}
          <Link to="/wishlist" className="relative">
            <Heart className="text-white text-2xl" />
            {wishListItems?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-1.5 rounded-full">
                {wishListItems.length}
              </span>
            )}
          </Link>

          {/* CART WITH PULSE */}
          <Sheet open={openCart} onOpenChange={setOpenCart}>
            <div className="relative">
              <FaShoppingCart
                onClick={() => setOpenCart(true)}
                className="text-white text-2xl cursor-pointer"
              />
              {totalCount > 0 && (
                <motion.span
                  key={totalCount}
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="absolute -top-2 -right-2 bg-red-600 text-xs px-1.5 rounded-full"
                >
                  {totalCount}
                </motion.span>
              )}
            </div>
            <SheetContent side="right" className="sm:max-w-md">
              <UserCartWrapper cartItems={cartItems} setOpenCartSheet={setOpenCart} />
            </SheetContent>
          </Sheet>

          {/* PROFILE */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {user ? (
                <>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => navigate("/login")}>
                  <User className="w-4 h-4 mr-2" /> Login
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* MOBILE MENU ICON */}
          <GiHamburgerMenu
            className="lg:hidden text-white text-2xl cursor-pointer"
            onClick={() => setIsMenu(true)}
          />
        </div>
      </div>

      {/* MOBILE SLIDE MENU */}
      <AnimatePresence>
        {isMenu && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-72 bg-[#F08C7D] p-6 text-white z-50"
          >
            <FaTimes className="text-2xl mb-6 cursor-pointer" onClick={() => setIsMenu(false)} />
            <Link to="/" onClick={() => setIsMenu(false)}>HOME</Link>
            <Link to="/about-us" onClick={() => setIsMenu(false)}>OUR STORY</Link>
            <Link to="/custombox" onClick={() => setIsMenu(false)}>CREATE BOX</Link>
            <Link to="/blog" onClick={() => setIsMenu(false)}>BLOG</Link>
            <Link to="/contact-us" onClick={() => setIsMenu(false)}>CONTACT US</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
