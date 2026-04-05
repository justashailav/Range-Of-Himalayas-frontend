import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  User,
  Calendar,
  Package,
  ArrowLeft,
  CheckCircle2,
  Globe,
  PlayCircle,
  Image as ImageIcon,
  History,
  Info,
  Droplets,
  Mountain,
  ShieldCheck,
  Navigation,
  ExternalLink,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getBatchById } from "@/store/slices/batchSlice";
import { useNavigate, useParams } from "react-router-dom";

export default function BatchDetail() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { batch, loading } = useSelector((state) => state.batch);
  useEffect(() => {
    if (batchId) {
      dispatch(getBatchById(batchId));
    }
  }, [batchId, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          <p className="text-slate-400 font-medium animate-pulse">
            Decrypting Batch Data...
          </p>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 max-w-md">
          <div className="text-6xl mb-4">🕵️‍♂️</div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">
            Batch Not Found
          </h2>
          <p className="text-slate-500 mb-8">
            The traceability record for this ID does not exist or has been
            archived.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all"
          >
            <ArrowLeft size={18} /> Return to Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 pb-20">
      {/* --- FLOATING NAV --- */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-bold text-sm">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Traceability Status
              </p>
              <p className="text-xs font-bold text-emerald-600">
                Active & Verified
              </p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
              <ShieldCheck className="text-emerald-600" size={20} />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-12">
        {/* --- HERO SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-[0.2em]">
                Batch Record
              </span>
              <span className="text-slate-300 font-light">|</span>
              <span className="text-emerald-600 font-mono text-sm font-bold">
                {batch.batchId}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
              {batch.productName}
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl font-medium">
              Harvested from the pristine slopes of {batch.origin?.state}, this
              batch represents our commitment to absolute purity and traditional
              methods.
            </p>
          </div>

          <div className="lg:col-span-4 flex items-end justify-start lg:justify-end">
            {batch.isVerified && (
              <div className="bg-white border-2 border-emerald-500 p-6 rounded-[2rem] shadow-lg shadow-emerald-50 rotate-2 hover:rotate-0 transition-transform cursor-help group">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500 p-3 rounded-2xl text-white">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase">
                      Authenticity
                    </p>
                    <h4 className="text-lg font-black text-slate-900">
                      100% Original
                    </h4>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: THE JOURNEY & MEDIA */}
          <div className="lg:col-span-8 space-y-12">
            {/* TIMELINE COMPONENT */}
            <section className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-slate-100 rounded-2xl">
                  <History className="text-slate-600" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-slate-800">
                  The Journey
                </h3>
              </div>

              <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-slate-200 before:to-transparent">
                {batch.timeline?.map((step, index) => (
                  <div
                    key={index}
                    className="relative flex items-start gap-10 group"
                  >
                    <div className="absolute left-0 w-10 h-10 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center z-10 group-hover:border-emerald-500 transition-colors">
                      <div className="w-2 h-2 bg-slate-300 group-hover:bg-emerald-500 rounded-full"></div>
                    </div>
                    <div className="pl-14">
                      <time className="text-[11px] font-black text-emerald-600 uppercase mb-1 block">
                        {step.date
                          ? new Date(step.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Process Phase"}
                      </time>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">
                        {step.step}
                      </h4>
                      <p className="text-slate-500 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* GALLERY */}
            {batch.images?.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <ImageIcon size={20} className="text-slate-400" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                    Field Photography
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {batch.images.map((img, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-[2.5rem] bg-slate-200 aspect-[4/3] border border-slate-100 shadow-sm"
                    >
                      <img
                        src={img}
                        alt="Batch record"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT: SPECIFICATIONS SIDEBAR */}
          <div className="lg:col-span-4 space-y-8">
            {/* ORIGIN CARD */}
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <Globe className="text-emerald-400" size={20} />
                  <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400">
                    Geographic Origin
                  </h3>
                </div>

                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Source Village
                    </p>
                    <p className="text-2xl font-bold">
                      {batch.origin?.location}
                    </p>
                    <p className="text-slate-400 font-medium">
                      {batch.origin?.state}, {batch.origin?.country}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Altitude
                      </p>
                      <p className="text-lg font-bold flex items-center gap-2">
                        <Mountain size={16} className="text-emerald-400" />{" "}
                        {batch.origin?.altitude}m
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Coordinates
                      </p>
                      <p className="text-sm font-mono text-slate-300">
                        {batch.origin?.lat}°, {batch.origin?.lng}°
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <Navigation size={200} />
              </div>
            </div>

            {/* FARMER CARD */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                  {batch.farmer?.image ? (
                    <img
                      src={batch.farmer.image}
                      alt="Farmer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      👨‍🌾
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Master Cultivator
                  </p>
                  <h4 className="text-xl font-black text-slate-900">
                    {batch.farmer?.name}
                  </h4>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold">Community</span>
                  <span className="text-slate-900 font-black">
                    {batch.farmer?.village}
                  </span>
                </div>
              </div>
            </div>

            {/* SPECS LIST */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                Batch Profile
              </h4>
              <div className="space-y-5">
                <DataRow
                  icon={<Calendar size={16} />}
                  label="Harvest Season"
                  value={batch.harvestSeason}
                />
                <DataRow
                  icon={<Droplets size={16} />}
                  label="Processing"
                  value={batch.processingMethod}
                />
                <DataRow
                  icon={<Package size={16} />}
                  label="Packaging"
                  value={batch.packagingType}
                />
                <DataRow
                  icon={<Info size={16} />}
                  label="Total Yield"
                  value={`${batch.totalUnits} Units`}
                />
              </div>
            </div>

            {/* VIDEO ACCESS */}
            {batch.videoUrl && (
              <a
                href={batch.videoUrl}
                target="_blank"
                className="group flex items-center justify-between bg-emerald-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                    <PlayCircle size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase opacity-70">
                      Visual Record
                    </p>
                    <p className="font-bold">Watch Process Video</p>
                  </div>
                </div>
                <ExternalLink size={18} className="opacity-50" />
              </a>
            )}
          </div>
        </div>

        {/* --- STORY FOOTER --- */}
        <section className="mt-20 border-t border-slate-200 pt-16 text-center max-w-3xl mx-auto">
          <div className="inline-block p-4 bg-white rounded-3xl shadow-sm border border-slate-100 mb-8">
            <Info className="text-emerald-600" size={32} />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-6">
            Behind the Batch
          </h3>
          <p className="text-xl text-slate-500 leading-relaxed font-medium italic">
            "{batch.story}"
          </p>
        </section>
      </main>
    </div>
  );
}

// Utility Component for Sidebar Rows
function DataRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-3 text-slate-400">
        {icon}
        <span className="text-[11px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span className="text-sm font-black text-slate-900 capitalize">
        {value}
      </span>
    </div>
  );
}
