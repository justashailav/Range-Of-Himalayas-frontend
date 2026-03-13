import React from "react";
import { FaInstagram, FaFacebook, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { IoLocationSharp, IoMailSharp, IoTimeSharp } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="bg-stone-50 text-stone-900 border-t border-stone-200 pt-20 pb-10">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
    
    {/* BRAND COLUMN */}
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-2xl font-black uppercase tracking-tighter text-stone-900">
          Range of Himalayas
        </h3>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B23A2E]">
          Botanical Origin
        </p>
      </div>
      <p className="text-sm leading-relaxed text-stone-500 font-serif italic">
        "Cultivating the pristine heights of Kotkhai. We bridge the gap between 
        ancient Himalayan soil and the modern table with natural, high-altitude harvests."
      </p>
    </div>

    {/* NAVIGATION: COMPANY */}
    <div className="space-y-6">
      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
        The Estate
      </h4>
      <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-stone-600">
        <li><a href="/about-us" className="hover:text-[#B23A2E] transition-colors">Our Story</a></li>
        <li><a href="/custombox" className="hover:text-[#B23A2E] transition-colors">Bespoke Crate</a></li>
        <li><a href="/blog" className="hover:text-[#B23A2E] transition-colors">Field Notes</a></li>
      </ul>
    </div>

    {/* NAVIGATION: SUPPORT */}
    <div className="space-y-6">
      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
        Concierge
      </h4>
      <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-stone-600">
        <li><a href="/faqs" className="hover:text-[#B23A2E] transition-colors">Common Inquiries</a></li>
        <li><a href="/shipping-policy" className="hover:text-[#B23A2E] transition-colors">Transit & Logistics</a></li>
        <li><a href="/return-policy" className="hover:text-[#B23A2E] transition-colors">Exchanges</a></li>
        <li><a href="/privacy-policy" className="hover:text-[#B23A2E] transition-colors">Privacy</a></li>
      </ul>
    </div>

    {/* CONTACT & SOCIAL */}
    <div className="space-y-6">
      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
        Correspondence
      </h4>
      <ul className="space-y-4 text-[11px] font-medium text-stone-600">
        <li className="flex items-start gap-3">
          <IoLocationSharp size={14} className="text-[#B23A2E] shrink-0 mt-0.5" />
          <span className="leading-tight uppercase tracking-wider">
            Bareon, Kotkhai, Shimla, <br />HP – 171204
          </span>
        </li>
        <li className="flex items-center gap-3">
          <IoMailSharp size={14} className="text-[#B23A2E]" />
          <a href="mailto:contactrangeofhimalayas@gmail.com" className="hover:text-[#B23A2E] transition-colors lowercase">
            hello@rangeofhimalayas.com
          </a>
        </li>
      </ul>

      <div className="pt-4 space-y-4">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400">Connect with the source</p>
        <div className="flex items-center gap-5 text-stone-900">
          <a href="#" className="hover:text-[#B23A2E] transition-all hover:-translate-y-1"><FaInstagram size={18} /></a>
          <a href="#" className="hover:text-[#B23A2E] transition-all hover:-translate-y-1"><FaFacebook size={18} /></a>
          <a href="#" className="hover:text-[#B23A2E] transition-all hover:-translate-y-1"><FaWhatsapp size={18} /></a>
        </div>
      </div>
    </div>
  </div>

  {/* BOTTOM BAR */}
  <div className="mt-20 max-w-7xl mx-auto px-6 pt-8 border-t border-stone-200/60">
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] text-stone-400">
      <p>© {new Date().getFullYear()} Range of Himalayas Archive</p>
      <p>Crafted for the Discerning Collector</p>
    </div>
  </div>
</footer>
  );
}
