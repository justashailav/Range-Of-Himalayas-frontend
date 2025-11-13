// import React, { useState } from "react";
// import { GiHamburgerMenu } from "react-icons/gi";
// import { FaTimes, FaShoppingCart } from "react-icons/fa";
// import { CiSearch } from "react-icons/ci";
// import { Link, useNavigate } from "react-router-dom";
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

// export default function Navbar() {
//   const [isMenu, setIsMenu] = useState(false);
//   const [openCart, setOpenCart] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const { user } = useSelector((state) => state.auth);
//   const { cartItems, boxes } = useSelector((state) => state.cart);
//   const { wishListItems } = useSelector((state) => state.wishList);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const toggleMenu = () => setIsMenu((prev) => !prev);

//   const handleSearch = () => {
//     if (searchTerm.trim().length > 2) {
//       dispatch(searchProducts(searchTerm.trim()));
//       navigate(`/search?keyword=${searchTerm.trim()}`);
//     }
//   };
//   const handleLogout = () => {
//   dispatch(resetAuthSlice());       
//   persistor.purge();                
//   navigate("/login");
// };
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") handleSearch();
//   };
//   const cartCount =
//     cartItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
//   const boxCount = boxes?.length || 0;
//   const totalCount = cartCount + boxCount;
//   const wishListCount = wishListItems?.length || 0;
//   return (
//     <nav className="bg-[#F08C7D] min-h-16 md:h-20 px-4 sm:px-6 lg:px-10 shadow-md">
//       <div className="flex items-center justify-between w-full">
//         <div className="flex items-center justify-between w-full md:flex lg:hidden">
//           <a href="/">
//             <img src={logo} className="w-24 sm:w-28 mt-1" alt="Logo" />
//           </a>

//           <div className="flex items-center gap-3 sm:gap-4">
//             {!user && (
//               <a href="/login">
//                 <button className="border-[#F08C7D] bg-[#F08C7D] text-white py-1 px-3 sm:py-2 sm:px-4 rounded-md text-sm sm:text-base hover:bg-[#FFECE8] hover:text-[#F08C7D] transition">
//                   LOGIN
//                 </button>
//               </a>
//             )}
//             <Sheet open={openCart} onOpenChange={setOpenCart}>
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
//                       <a href="/profile">
//                         <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
//                           <User className="w-4 h-4 text-muted-foreground" />
//                           Profile
//                         </DropdownMenuItem>
//                       </a>
//                       <a href="/account">
//                         <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
//                           <User className="w-4 h-4 text-muted-foreground" />
//                           Account
//                         </DropdownMenuItem>
//                       </a>
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
//                       <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer" onClick={handleLogout}>
//                         <LogOut className="w-4 h-4 text-muted-foreground" />
//                         Logout
//                       </DropdownMenuItem>
//                     </>
//                   ) : (
//                     <a href="/login">
//                       <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
//                         <User className="w-4 h-4 text-muted-foreground" />
//                         Login
//                       </DropdownMenuItem>
//                     </a>
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
//           <a href="/" className="flex-shrink-0 ">
//             <img src={logo} className="w-28 sm:w-32 lg:w-36" alt="Logo" />
//           </a>
//           <div className="flex mb-2 gap-4 lg:gap-6 text-white font-bold text-base lg:text-lg flex-1 justify-center whitespace-nowrap">
//             <a href="/">HOME</a>
//             <a href="/about-us">OUR STORY</a>
//             <a href="/custombox">CREATE BOX</a>
//             <a href="/blog">BLOG</a>
//             <a href="/contact-us">CONTACT US</a>
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
//               <a href="/login">
//                 <button className="border-[#F08C7D] font-semibold bg-[#F08C7D] text-white py-1 md:py-2 px-3 md:px-4 rounded-lg hover:bg-[#FFECE8] hover:text-[#F08C7D] transition duration-500 text-sm md:text-base">
//                   LOGIN
//                 </button>
//               </a>
//             )}

//             <div className="relative">
//               <a href="/wishlist">
//                 <Heart color="white" className="cursor-pointer text-2xl" />
//                 {wishListCount > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
//                     {wishListCount}
//                   </span>
//                 )}
//               </a>
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
//                       <a href="/profile">
//                         <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
//                           <User className="w-4 h-4 text-muted-foreground" />
//                           Profile
//                         </DropdownMenuItem>
//                       </a>
//                       <a href="/account">
//                         <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
//                           <User className="w-4 h-4 text-muted-foreground" />
//                           Account
//                         </DropdownMenuItem>
//                       </a>
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

//                       <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer" onClick={handleLogout}>
//                         <LogOut className="w-4 h-4 text-muted-foreground" />
//                         Logout
//                       </DropdownMenuItem>
//                     </>
//                   ) : (
//                     <a href="/login">
//                       <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
//                         <User className="w-4 h-4 text-muted-foreground" />
//                         Login
//                       </DropdownMenuItem>
//                     </a>
//                   )}
//                 </DropdownMenuGroup>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </div>
//       {isMenu && (
//         <div className="fixed top-0 right-0 h-full w-64 sm:w-72 md:w-80 lg:hidden bg-[#F08C7D] shadow-lg p-6 flex flex-col gap-5 text-white z-50 transition-transform transform translate-x-0">
//           <div className="flex justify-end mb-4">
//             <FaTimes
//               className="text-2xl sm:text-3xl cursor-pointer hover:text-gray-200 transition"
//               onClick={toggleMenu}
//             />
//           </div>

//           <a
//             href="/"
//             className="hover:text-gray-200 text-base sm:text-lg"
//             onClick={toggleMenu}
//           >
//             HOME
//           </a>
//           <a
//             href="/about-us"
//             className="hover:text-gray-200 text-base sm:text-lg"
//             onClick={toggleMenu}
//           >
//             OUR STORY
//           </a>
//           <a
//             href="/custombox"
//             className="hover:text-gray-200 text-base sm:text-lg"
//             onClick={toggleMenu}
//           >
//             CREATE BOX
//           </a>

//           <a
//             href="/blog"
//             className="hover:text-gray-200 text-base sm:text-lg"
//             onClick={toggleMenu}
//           >
//             BLOG
//           </a>
//           <a
//             href="/contact-us"
//             className="hover:text-gray-200 text-base sm:text-lg"
//             onClick={toggleMenu}
//           >
//             CONTACT US
//           </a>

//           <div className="relative mt-2">
//             <CiSearch
//               className="absolute right-3 top-2 text-white text-2xl cursor-pointer"
//               onClick={handleSearch}
//             />
//             <input
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onKeyDown={handleKeyDown}
//               className="w-full pl-2 pr-10 py-2 rounded-md border-none placeholder-white text-white bg-white/20 backdrop-blur-sm"
//             />
//           </div>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Avatar className="cursor-pointer ring-2 ring-gray-300 mt-4">
//                 <AvatarImage
//                   src={
//                     user?.profile?.profilePhoto ||
//                     "https://github.com/shadcn.png"
//                   }
//                 />
//               </Avatar>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-56 p-2 mt-2 shadow-lg rounded-xl">
//               <DropdownMenuGroup>
//                 {user ? (
//                   <>
//                     <a href="/profile">
//                       <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
//                         <User className="w-4 h-4 text-muted-foreground" />
//                         Profile
//                       </DropdownMenuItem>
//                     </a>
//                     <a href="/account">
//                       <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
//                         <User className="w-4 h-4 text-muted-foreground" />
//                         Account
//                       </DropdownMenuItem>
//                     </a>
//                     <div>
//                       <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
//                         <Button
//                           onClick={() => navigate("/order-tracking")}
//                           className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
//                         >
//                           Track your order
//                         </Button>
//                       </DropdownMenuItem>
//                     </div>
//                     <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer" onClick={handleLogout}>
//                       <LogOut className="w-4 h-4 text-muted-foreground" />
//                       Logout
//                     </DropdownMenuItem>
//                   </>
//                 ) : (
//                   <a href="/login">
//                     <DropdownMenuItem className="gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer">
//                       <User className="w-4 h-4 text-muted-foreground" />
//                       Login
//                     </DropdownMenuItem>
//                   </a>
//                 )}
//               </DropdownMenuGroup>
//             </DropdownMenuContent>
//           </DropdownMenu>

//           {!user && (
//             <a href="/login">
//               <button className="border-[#F08C7D] bg-[#FFECE8] text-[#F08C7D] py-2 px-4 rounded-md font-semibold mt-4 hover:bg-[#F08C7D] hover:text-white transition">
//                 LOGIN
//               </button>
//             </a>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// }

import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/logo-himalayas.png";

export default function Navbar() {
  const [isMenu, setIsMenu] = useState(false);
  const toggleMenu = () => setIsMenu((prev) => !prev);

  return (
    <nav className="bg-[#F08C7D] min-h-16 md:h-20 px-4 sm:px-6 lg:px-10 shadow-md">
      <div className="flex items-center justify-between w-full">
        {/* ✅ Logo and Menu (Mobile) */}
        <div className="flex items-center justify-between w-full md:flex lg:hidden">
          <Link to="/">
            <img src={logo} className="w-24 sm:w-28 mt-1" alt="Logo" />
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* ❌ Login / Cart / Avatar removed for now */}
            {isMenu ? (
              <FaTimes
                className="text-2xl sm:text-3xl text-white cursor-pointer hover:text-gray-200 transition"
                onClick={toggleMenu}
              />
            ) : (
              <GiHamburgerMenu
                className="text-2xl sm:text-3xl text-white cursor-pointer hover:text-gray-200 transition"
                onClick={toggleMenu}
              />
            )}
          </div>
        </div>

        {/* ✅ Desktop Navbar */}
        <div className="hidden lg:flex items-center justify-between w-full">
          <Link to="/" className="flex-shrink-0">
            <img src={logo} className="w-28 sm:w-32 lg:w-36" alt="Logo" />
          </Link>

          <div className="flex mb-2 gap-4 lg:gap-6 text-white font-bold text-base lg:text-lg flex-1 justify-center whitespace-nowrap">
            <Link to="/">HOME</Link>
            <Link to="/about-us">OUR STORY</Link>
            <Link to="/custombox">CREATE BOX</Link>
            <Link to="/blog">BLOG</Link>
            <Link to="/contact-us">CONTACT US</Link>
          </div>

          {/* ❌ Temporarily hide search, login, wishlist, cart, profile */}
          {/*
          <div className="flex mb-2 items-center gap-3 lg:gap-6">
            ... (search, login, cart, avatar dropdown)
          </div>
          */}
        </div>
      </div>

      {/* ✅ Mobile Menu Drawer */}
      {isMenu && (
        <div className="fixed top-0 right-0 h-full w-64 sm:w-72 md:w-80 lg:hidden bg-[#F08C7D] shadow-lg p-6 flex flex-col gap-5 text-white z-50 transition-transform transform translate-x-0">
          <div className="flex justify-end mb-4">
            <FaTimes
              className="text-2xl sm:text-3xl cursor-pointer hover:text-gray-200 transition"
              onClick={toggleMenu}
            />
          </div>

          <Link to="/" onClick={toggleMenu}>HOME</Link>
          <Link to="/about-us" onClick={toggleMenu}>OUR STORY</Link>
          <Link to="/custombox" onClick={toggleMenu}>CREATE BOX</Link>
          <Link to="/blog" onClick={toggleMenu}>BLOG</Link>
          <Link to="/contact-us" onClick={toggleMenu}>CONTACT US</Link>

          {/* ❌ Hide login & search for now */}
          {/*
          <input placeholder="Search..." ... />
          <button>LOGIN</button>
          */}
        </div>
      )}
    </nav>
  );
}
