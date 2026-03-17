import React from "react";
import {
  CheckCircle,
  Phone,
  FileText,
  ShieldCheck,
  RefreshCcw,
  AlertTriangle,
} from "lucide-react";
import { Helmet } from "react-helmet";

export default function RefundPolicy() {
  return (
    <div className="mx-auto  bg-[#FFF8E1] px-6 py-12">
     <Helmet>
        <title>Refund & Return Policy - Range Of Himalayas</title>
        <meta
          name="description"
          content="Range Of Himalayas refund, return, and cancellation policy. Learn how we ensure customer satisfaction with clear and transparent return and refund procedures for fresh Himalayan produce."
        />
      </Helmet>

      {/* Header */}
      <section className="bg-[#0D0D0D] py-20 md:py-32 px-6 sm:px-10 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER: Archive Style */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#F08C7D]" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#F08C7D]">
              Resolution Bureau
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-8">
            Exchanges <br />
            <span className="font-serif italic capitalize tracking-normal text-stone-500 ml-8 md:ml-16">
              & Resolutions
            </span>
          </h1>
        </div>

        {/* SATISFACTION BANNER */}
        <div className="relative bg-white/[0.03] border-l-2 border-[#F08C7D] p-8 md:p-12 mb-24 flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0">
             <CheckCircle className="h-16 w-16 text-[#F08C7D] opacity-80" strokeWidth={1} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-3">
              The 100% Satisfaction Mandate
            </h2>
            <p className="text-stone-400 font-serif italic text-lg leading-relaxed">
              "Your experience with our high-altitude harvests is paramount. Should your dispatch fail to meet 
              the botanical standards we promise, our transparent resolution protocol ensures a swift and seamless correction."
            </p>
          </div>
        </div>

        {/* ELIGIBILITY GRID */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.5em]">Eligibility Matrix</h3>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* ELIGIBLE */}
            <div className="space-y-8">
              <h3 className="text-[#F08C7D] text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F08C7D]" /> Approved for Resolution
              </h3>
              <ul className="space-y-6">
                {[
                  "Transit damage or compromised structural integrity",
                  "Significant deviation from botanical description",
                  "Incorrect SKU or harvest batch delivery",
                  "Quality discrepancies (excessive bruising or rot)"
                ].map((text, i) => (
                  <li key={i} className="flex gap-4 group">
                    <span className="text-[10px] font-serif italic text-stone-600 mt-1">/0{i+1}</span>
                    <span className="text-stone-300 uppercase tracking-widest text-[11px] font-black group-hover:text-white transition-colors">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* NOT ELIGIBLE */}
            <div className="space-y-8">
              <h3 className="text-stone-500 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-stone-700" /> Resolution Exclusions
              </h3>
              <ul className="space-y-6">
                {[
                  "Subjective flavor profile or natural texture variations",
                  "Minor aesthetic imperfections inherent to organic growth",
                  "Products consumed beyond the evaluation sample",
                  "Claims initiated after the 24-hour verification window"
                ].map((text, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="text-[10px] font-serif italic text-stone-700 mt-1">/0{i+1}</span>
                    <span className="text-stone-500 uppercase tracking-widest text-[11px] font-black">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* RETURN PROCESS: Timeline Style */}
        <section className="mb-32">
          <h2 className="text-xs font-black text-white uppercase tracking-[0.5em] mb-12">Submission Protocol</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {[
              { step: "Submit Request", icon: FileText, desc: "Log your claim via the digital portal within 24 hours." },
              { step: "Visual Evidence", icon: Phone, desc: "Upload photographic verification of the discrepancies." },
              { step: "Archive Review", icon: ShieldCheck, desc: "Our Quality Team audits the claim within 48 hours." },
              { step: "Resolution", icon: RefreshCcw, desc: "Formal approval of refund or replacement dispatch." }
            ].map((item, i) => (
              <div key={i} className="bg-[#0D0D0D] p-8 hover:bg-white/[0.02] transition-colors">
                <item.icon className="h-6 w-6 text-[#F08C7D] mb-6 opacity-60" strokeWidth={1} />
                <h4 className="text-white text-[11px] font-black uppercase tracking-widest mb-3">{item.step}</h4>
                <p className="text-stone-500 text-xs font-serif italic leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 border border-[#F08C7D]/20 p-6 flex items-start gap-4">
            <AlertTriangle className="h-5 w-5 text-[#F08C7D] shrink-0" />
            <p className="text-[10px] text-stone-400 uppercase tracking-widest leading-loose">
              <strong className="text-white">Preservation Requirement:</strong> Please retain all botanical samples in their original packaging until the audit is finalized. Visual documentation is mandatory.
            </p>
          </div>
        </section>

        {/* REFUND & CANCELLATION: Two Column Manifest */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-white/5 pt-20">
          {/* Refunds */}
          <div className="space-y-10">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Refund <span className="text-stone-500 font-serif italic capitalize tracking-normal">Schedule</span></h2>
            <div className="space-y-4">
              {[
                { label: "Return Approval", time: "1–2 Business Days" },
                { label: "Internal Processing", time: "2–3 Business Days" },
                { label: "Electronic Reversal", time: "5–7 Business Days" },
                { label: "Store Credit", time: "Instantaneous (+5% Bonus)" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-end border-b border-white/5 pb-2 group">
                  <span className="text-[11px] text-stone-400 uppercase tracking-widest group-hover:text-white transition-colors">{item.label}</span>
                  <span className="text-[11px] text-[#F08C7D] font-black uppercase tracking-widest">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cancellations */}
          <div className="space-y-10">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Order <span className="text-stone-500 font-serif italic capitalize tracking-normal">Revocation</span></h2>
            <div className="bg-white/[0.02] p-8 border border-white/5">
              <ul className="space-y-6">
                {[
                  "Cancellations permitted within 60 minutes of placement.",
                  "Revocation only possible prior to fulfillment protocol.",
                  "Post-dispatch cancellations require refusal of shipment.",
                  "Full reversals processed within 7 business days."
                ].map((text, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="h-1 w-1 rounded-full bg-[#F08C7D] mt-2" />
                    <span className="text-stone-400 font-serif italic text-sm leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
