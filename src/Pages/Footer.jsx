import React from "react";
import { FaInstagram, FaFacebook} from "react-icons/fa";
import { IoLocationSharp, IoMailSharp} from "react-icons/io5";
export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-white border-t border-white/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12">
        
        {/* BRAND COLUMN: The Signature */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">
              Range of <br /> Himalayas
            </h3>
            <div className="flex items-center gap-2">
              <span className="h-px w-4 bg-[#F08C7D]" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#F08C7D]">
                Botanical Origin
              </p>
            </div>
          </div>
          <p className="text-[13px] leading-relaxed text-stone-400 font-serif italic max-w-xs">
            "Cultivating the pristine heights of Kotkhai. We bridge the gap
            between ancient Himalayan soil and the modern table."
          </p>
        </div>

        {/* NAVIGATION: THE ESTATE */}
<div className="space-y-8">
  <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-500">
    The Estate
  </h4>
  <ul className="space-y-4 text-[12px] font-black uppercase tracking-[0.2em] text-stone-300">
    {[
      { name: 'Our Story', path: '/about-us' },
      { name: 'Bespoke Crate', path: '/custombox' },
      { name: 'Field Notes', path: '/blog' }
    ].map((link) => (
      <li key={link.name}>
        <a 
          href={link.path} 
          className="hover:text-[#F08C7D] transition-all duration-300 group flex items-center"
        >
          <span className="w-0 group-hover:w-4 h-px bg-[#F08C7D] transition-all duration-300 mr-0 group-hover:mr-2" />
          {link.name}
        </a>
      </li>
    ))}
  </ul>
</div>

{/* NAVIGATION: CONCIERGE */}
<div className="space-y-8">
  <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-500">
    Concierge
  </h4>
  <ul className="space-y-4 text-[12px] font-black uppercase tracking-[0.2em] text-stone-300">
    {[
      { name: 'Common Inquiries', path: '/faqs' },
      { name: 'Transit & Logistics', path: '/shipping-policy' },
      { name: 'Exchanges', path: '/return-policy' },
      { name: 'Privacy', path: '/privacy-policy' }
    ].map((link) => (
      <li key={link.name}>
        <a 
          href={link.path} 
          className="hover:text-[#F08C7D] transition-all duration-300 group flex items-center"
        >
          <span className="w-0 group-hover:w-4 h-px bg-[#F08C7D] transition-all duration-300 mr-0 group-hover:mr-2" />
          {link.name}
        </a>
      </li>
    ))}
  </ul>
</div>
        {/* CORRESPONDENCE: CONTACT */}
        <div className="space-y-8">
          <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-500">
            Correspondence
          </h4>
          <div className="space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="p-2 bg-white/5 rounded-full group-hover:bg-[#F08C7D]/20 transition-colors">
                <IoLocationSharp size={14} className="text-[#F08C7D]" />
              </div>
              <span className="text-[11px] leading-relaxed uppercase tracking-widest text-stone-400">
                Bareon, Kotkhai, Shimla, <br />
                HP – 171204
              </span>
            </div>
            
            <div className="flex items-center gap-4 group">
              <div className="p-2 bg-white/5 rounded-full group-hover:bg-[#F08C7D]/20 transition-colors">
                <IoMailSharp size={14} className="text-[#F08C7D]" />
              </div>
              <a href="mailto:contact@rangehimalayas.com" className="text-[11px] lowercase tracking-widest text-stone-400 hover:text-white transition-colors">
                contactrangeofhimalayas@gmail.com
              </a>
            </div>

            <div className="pt-4 flex items-center gap-6">
              <a href="https://www.instagram.com/range.of.himalayas" className="text-stone-500 hover:text-[#F08C7D] transition-all hover:-translate-y-1">
                <FaInstagram size={20} />
              </a>
              <a href="https://www.facebook.com/rangeofhimalayas" className="text-stone-500 hover:text-[#F08C7D] transition-all hover:-translate-y-1">
                <FaFacebook size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* SUB-FOOTER */}
      <div className="mt-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-[9px] font-black uppercase tracking-[0.6em] text-stone-600">
              © {new Date().getFullYear()} Range of Himalayas Archive
            </p>
          </div>
          
          <div className="h-px w-12 bg-white/10 hidden md:block" />
          
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-stone-600">
            Crafted for the Discerning Collector
          </p>
        </div>
      </div>
    </footer>
  );
}
