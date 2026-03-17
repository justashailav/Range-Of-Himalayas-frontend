import React from "react";
import {
  Truck,
  ShieldCheck,
  CheckCircle,
  PackageCheck,
  MapPin,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
const steps = [
  {
    icon: CheckCircle,
    title: "Order Confirmation",
    desc: "An instant confirmation email is sent right after you place your order.",
  },
  {
    icon: PackageCheck,
    title: "Processing",
    desc: "Your order is processed and packed within 24 hours on business days.",
  },
  {
    icon: Truck,
    title: "Tracking",
    desc: "Track your order anytime using your Order ID. You’ll receive email updates at every stage.",
  },
  {
    icon: MapPin,
    title: "Delivery",
    desc: "A final email notification is sent once your order has been successfully delivered.",
  },
];

const deliveryNotes = [
  "Someone must be available to receive the delivery.",
  "A valid ID may be required for delivery verification.",
  "We will attempt delivery up to 2–3 times before returning the order.",
  "Delivery address cannot be updated once the order is placed.",
  "Delivery times are estimated and not guaranteed.",
  "Delays may occur due to weather, festivals, or other unforeseen circumstances.",
];

export default function ShippingPolicy() {
  return (
    <div className="mx-auto bg-[#FFF8E1] px-6 py-12">
      <Helmet>
        <title>Shipping Policy - Range Of Himalayas</title>
        <meta
          name="description"
          content="Learn about Range Of Himalayas' shipping policy — delivery timelines, areas covered, and our commitment to fresh Himalayan produce, delivered Pan India."
        />
        <meta
          name="keywords"
          content="Shipping policy, delivery, Range Of Himalayas, fresh apples, kiwis, Pan India delivery"
        />
        <meta name="author" content="Range Of Himalayas" />
      </Helmet>
      {/* Header Section */}
      <div className="bg-[#111111] border border-white/5 rounded-none p-10 md:p-16 mb-16 text-center relative overflow-hidden group">
        {/* Subtitle / Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="h-px w-6 bg-[#F08C7D]/40" />
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#F08C7D]">
            Global Logistics
          </span>
          <div className="h-px w-6 bg-[#F08C7D]/40" />
        </motion.div>

        {/* Icon Section */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Decorative pulse effect */}
            <div className="absolute inset-0 bg-[#F08C7D]/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-1000" />

            <Truck
              strokeWidth={1}
              className="h-16 w-16 text-white relative z-10 opacity-80"
            />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9] max-w-2xl mx-auto">
          Nature’s Freshness, <br />
          <span className="font-serif italic capitalize tracking-normal text-stone-500">
            Direct to your estate
          </span>
        </h1>

        {/* Decorative "Stamp" or Detail */}
        <div className="mt-10 flex flex-col items-center gap-2">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-600">
            Verified High-Altitude Transit
          </p>
          <div className="h-12 w-px bg-gradient-to-b from-[#F08C7D] to-transparent" />
        </div>

        {/* Background Grain/Texture (Optional) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      {/* Commitment Section */}
      <div className="relative bg-[#111111] border-l-2 border-[#F08C7D] p-8 md:p-12 mb-16 overflow-hidden group">
  {/* Decorative Background Element: Large faint number or logo */}
  <div className="absolute -right-4 -bottom-8 text-[120px] font-black text-white/[0.02] select-none pointer-events-none tracking-tighter">
    HP
  </div>

  <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
    {/* ICON: Minimalist & Refined */}
    <div className="shrink-0 p-4 bg-white/5 rounded-full border border-white/10 group-hover:border-[#F08C7D]/30 transition-colors duration-500">
      <ShieldCheck 
        strokeWidth={1} 
        className="h-10 w-10 text-[#F08C7D] opacity-80" 
      />
    </div>

    <div className="space-y-4">
      {/* Label */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-500">
          Quality Mandate
        </span>
        <div className="h-px w-8 bg-white/10" />
      </div>

      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
        Our Himalayan <span className="font-serif italic capitalize tracking-normal text-stone-400">Promise</span>
      </h2>

      {/* Body: High-readability font stack */}
      <p className="text-stone-400 text-base md:text-lg leading-relaxed font-serif italic max-w-3xl">
        "At Range Of Himalayas, our mission is to offer you premium,
        farm-fresh harvests delivered with care and efficiency. From the
        moment of cultivation until it reaches your estate, we ensure a
        seamless experience that leaves you with both peace of mind and a
        taste of nature’s <span className="text-white not-italic font-sans font-black uppercase text-[10px] tracking-widest ml-1">Purity Verified</span>."
      </p>
    </div>
  </div>

  {/* Subtle "Stamp" Detail in the Corner */}
  <div className="absolute top-6 right-8 hidden md:block">
    <div className="text-[8px] font-black uppercase tracking-[0.4em] text-stone-700 vertical-text py-4 border-y border-stone-800">
      EST. KOTKHAI
    </div>
  </div>
</div>

      {/* --- NEW Order Processing Section --- */}
    <div className="bg-[#0D0D0D] border border-white/5 p-8 md:p-16 mb-16 space-y-24">
  
  {/* SECTION 1: ORDER PROCESSING TIMELINE */}
  <section>
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-[#F08C7D]" />
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#F08C7D]">
            Phase 01
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
          Order <span className="font-serif italic capitalize tracking-normal text-stone-500">Processing</span>
        </h2>
      </div>
      <p className="text-stone-400 text-sm font-serif italic max-w-sm">
        "Once payment is verified, our estate team initiates the cold-chain 
        preparation protocol to preserve peak botanical integrity."
      </p>
    </div>

    {/* Steps Grid: Refined & Numbered */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-px bg-white/5 border border-white/5">
      {steps.map(({ icon: Icon, title, desc }, index) => (
        <div
          key={index}
          className="bg-[#0D0D0D] p-8 group hover:bg-white/[0.02] transition-colors duration-500"
        >
          <div className="flex justify-between items-start mb-8">
            <Icon strokeWidth={1} className="h-8 w-8 text-stone-500 group-hover:text-[#F08C7D] transition-colors" />
            <span className="text-[10px] font-black text-white/10 group-hover:text-[#F08C7D]/20">0{index + 1}</span>
          </div>
          <h4 className="text-xs font-black text-white uppercase tracking-widest mb-3">{title}</h4>
          <p className="text-[13px] text-stone-500 leading-relaxed font-serif italic">{desc}</p>
        </div>
      ))}
    </div>
  </section>

  {/* SECTION 2: SPECIAL CONSIDERATIONS */}
  <section>
    <div className="flex items-center gap-4 mb-10">
      <h2 className="text-xs font-black text-white uppercase tracking-[0.5em]">
        Special Delivery Considerations
      </h2>
      <div className="h-px flex-1 bg-white/5" />
    </div>

    {/* Alert Box: Minimalist "Technical Note" Style */}
    <div className="relative border border-[#F08C7D]/20 p-8 md:p-12 overflow-hidden">
      {/* Decorative Warning Background */}
      <div className="absolute top-0 right-0 p-4 opacity-10">
         <AlertTriangle size={80} className="text-[#F08C7D]" strokeWidth={1} />
      </div>

      <h3 className="text-[11px] font-black text-[#F08C7D] uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F08C7D] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F08C7D]"></span>
        </span>
        Important Information:
      </h3>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        {deliveryNotes.map((note, i) => (
          <li key={i} className="flex items-start gap-4">
            <span className="text-[10px] font-serif italic text-stone-600 mt-1">/0{i + 1}</span>
            <span className="text-stone-400 text-sm leading-relaxed tracking-wide uppercase font-black text-[10px]">
              {note}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </section>
</div>

      {/* --- NEW Order Tracking Section --- */}
      <div className="bg-[#111111] border border-white/5 p-8 md:p-12 mb-10 relative overflow-hidden group">
  {/* Background Decoration: Faint Tracking Grid */}
  <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex justify-around">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="w-px h-full bg-white" />
    ))}
  </div>

  <div className="relative z-10">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#F08C7D]">
            Real-Time Telemetry
          </span>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
          Order <span className="font-serif italic capitalize tracking-normal text-stone-500">Tracking</span>
        </h2>
      </div>

      {/* Mock Button for visual flavor */}
      <button className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#F08C7D] hover:text-white transition-all duration-500">
        Enter Order ID
      </button>
    </div>

    <p className="text-stone-400 text-sm md:text-base font-serif italic mb-10 max-w-2xl leading-relaxed">
      "Monitor your harvest's journey from our Kotkhai estate to your residence. 
      Utilize the unique digital signature provided in your confirmation dispatch."
    </p>

    {/* The Timeframe Note: Refined Minimalist Style */}
    <div className="border-t border-white/5 pt-8 flex items-start gap-4 group/note">
      <div className="p-2 bg-white/5 rounded-full group-hover/note:bg-[#F08C7D]/10 transition-colors duration-500">
        <Clock className="h-5 w-5 text-[#F08C7D] opacity-60" strokeWidth={1.5} />
      </div>
      
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-stone-300">
          Temporal Estimates
        </p>
        <p className="text-stone-500 text-[11px] md:text-xs leading-relaxed uppercase tracking-wider max-w-xl">
          Standard transits are strictly adhered to; however, atmospheric or logistics 
          fluctuations in the Himalayan region may necessitate marginal adjustments.
        </p>
      </div>
    </div>
  </div>

  {/* Corner Detail: Archive Stamp */}
  <div className="absolute bottom-0 right-0 p-4 border-t border-l border-white/5">
    <span className="text-[8px] font-black text-white/5 uppercase tracking-[0.5em]">
      Purely Himalayan
    </span>
  </div>
</div>

      {/* --- Existing Shipping Policy Section --- */}
     <div className="bg-[#0D0D0D] border border-white/5 p-8 md:p-16 mb-10 space-y-24">
  
  {/* HEADER: Transit Mandate */}
  <section>
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-[#F08C7D] opacity-80" strokeWidth={1} />
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#F08C7D]">
            Shipping Policy
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
          Transit <br />
          <span className="font-serif italic capitalize tracking-normal text-stone-500 ml-8 md:ml-16">
            Timeframes
          </span>
        </h2>
      </div>
      <p className="text-stone-400 text-sm font-serif italic max-w-sm leading-relaxed">
        "We facilitate nationwide distribution across the Indian subcontinent. 
        Transit durations are influenced by regional atmospheric conditions and 
        high-altitude logistics."
      </p>
    </div>

    {/* Delivery Cards: Grid with thin dividers */}
    <div className="grid grid-cols-1 md:grid-cols-3 border border-white/10 divide-y md:divide-y-0 md:divide-x divide-white/10">
      {[
        { title: "Metro Hubs", time: "2–4 Days", desc: "Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune" },
        { title: "Tier II Regions", time: "3–6 Days", desc: "State capitals and primary urban sectors" },
        { title: "Remote Frontiers", time: "5–10 Days", desc: "Rural territories and high-altitude locations" }
      ].map((zone, i) => (
        <div key={i} className="p-8 group hover:bg-white/[0.02] transition-colors duration-500">
          <span className="text-[10px] font-black text-[#F08C7D]/40 block mb-6 uppercase tracking-widest">
            Sector 0{i+1}
          </span>
          <h4 className="text-white font-black uppercase tracking-tighter text-xl mb-2">
            {zone.title}
          </h4>
          <p className="text-[#F08C7D] text-sm font-serif italic mb-4">
            Estimated dispatch: {zone.time}
          </p>
          <p className="text-[11px] text-stone-500 uppercase tracking-widest leading-loose font-black">
            {zone.desc}
          </p>
        </div>
      ))}
    </div>
  </section>

  {/* SECTION: Shipping Charges - The "Complimentary" Benefit */}
  <section className="relative overflow-hidden border border-[#F08C7D]/20 p-10 md:p-16">
    <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
      <div className="flex-1 space-y-6">
        <h3 className="text-[10px] font-black text-[#F08C7D] uppercase tracking-[0.6em]">
          Logistics Premium
        </h3>
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
          Complimentary <br />
          <span className="font-serif italic capitalize tracking-normal text-stone-500">
            Nationwide Shipping
          </span>
        </h2>
        <p className="text-stone-400 text-base md:text-lg font-serif italic max-w-xl">
          "As part of our commitment to the discerning collector, all archival 
          harvests are delivered with zero transit fees. Pure botanical value, 
          delivered without compromise."
        </p>
      </div>

      <div className="w-full md:w-auto">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 space-y-6">
          <div className="space-y-2">
            <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Fee Structure</p>
            <div className="flex justify-between items-end">
              <span className="text-white text-xs uppercase tracking-widest">Standard Transit</span>
              <span className="text-[#F08C7D] font-black text-xs uppercase tracking-widest">Gratis</span>
            </div>
            <div className="h-px bg-white/10 w-full" />
          </div>
          <div className="space-y-2">
            <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Priority Handling</p>
            <div className="flex justify-between items-end">
              <span className="text-white text-xs uppercase tracking-widest">Express Dispatch</span>
              <span className="text-[#F08C7D] font-black text-xs uppercase tracking-widest">Inclusive</span>
            </div>
            <div className="h-px bg-white/10 w-full" />
          </div>
        </div>
      </div>
    </div>
    
    {/* Background Text watermark */}
    <div className="absolute -bottom-10 -right-10 text-[180px] font-black text-white/[0.02] leading-none pointer-events-none uppercase">
      Free
    </div>
  </section>
</div>
    </div>
  );
}
