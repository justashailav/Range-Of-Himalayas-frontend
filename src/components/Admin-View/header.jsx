import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

export default function Adminheader({ setOpen }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#FFECE8]">
      <Button
        className="bg-[#F08C7D] text-white py-2 px-4 rounded-lg lg:hidden sm:block"
        onClick={() => setOpen(true)}
      >
        <GiHamburgerMenu />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex-1"></div>
      <div>
        <button className="flex items-center gap-2 bg-[#F08C7D] text-white py-2 px-4 rounded-lg">
          <LogOut />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
