import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getBatchById } from "@/store/slices/batchSlice";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin, User, Calendar, Package, ArrowLeft,
  CheckCircle2, Globe, PlayCircle, Image as ImageIcon,
  History, Info, Droplets, Mountain, ShieldCheck,
  Navigation, ExternalLink, ChevronRight
} from "lucide-react";

export default function BatchDetail() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { batch, loading } = useSelector((state) => state.batch);

  useEffect(() => {
    if (batchId) {
      dispatch(getBatchById(batchId));
    }
    window.scrollTo(0, 0);
  }, [batchId, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 max-w-sm">
          <div className="text-5xl mb-4">🕵️‍♂️</div>
          <h2 className="text-xl font-black text-slate-800 mb-2">Record Missing</h2>
          <p className="text-slate-500 text-sm mb-8">This batch ID could not be verified in our blockchain records.</p>
          <button onClick={() => navigate("/")} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
            <ArrowLeft size={18} /> Back to Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-12 selection:bg-emerald-100">
      {/* --- MOBILE COMPACT NAV --- */}
      <nav className="sticky top-0 z-[1000] bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={22} className="text-slate-700" />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Verified Origin</span>
          </div>
          <div className="w-8"></div> {/* Spacer for symmetry */}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-6 md:pt-12">
        
        {/* --- HERO SECTION --- */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 mb-10 md:mb-16">
          <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                Batch #{batch.batchId}
              </span>
              <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">
                Live Traceability
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-4 md:mb-6 leading-[1.1] tracking-tight">
              {batch.productName}
            </h1>
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl">
              Ethically sourced from <span className="text-slate-900 font-bold">{batch.origin?.location}</span>. 
              Verified for purity, tradition, and sustainability.
            </p>
          </div>

          <div className="lg:col-span-4 order-1 lg:order-2 flex justify-start lg:justify-end">
            {batch.isVerified && (
              <div className="w-full md:w-auto bg-white border-2 border-emerald-500 p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] shadow-xl shadow-emerald-100/50 flex lg:block items-center gap-4 lg:rotate-3 transition-transform">
                <div className="bg-emerald-500 p-3 rounded-xl md:rounded-2xl text-white inline-block lg:mb-4">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Blockchain Verified</p>
                  <h4 className="text-lg font-black text-slate-900 leading-none">Authentic</h4>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- CORE CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-8 md:space-y-12">
            
            {/* TIMELINE - MOBILE ADAPTIVE */}
            <section className="bg-white border border-slate-200 rounded-3xl md:rounded-[3rem] p-6 md:p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-8 md:mb-10">
                <div className="p-2 bg-emerald-50 rounded-lg"><History className="text-emerald-600" size={20}/></div>
                <h3 className="text-sm md:text-lg font-black uppercase tracking-widest text-slate-800">The Journey</h3>
              </div>
              
              <div className="relative space-y-10 md:space-y-12 before:absolute before:inset-0 before:ml-4 md:before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                {batch.timeline?.map((step, index) => (
                  <div key={index} className="relative flex items-start gap-6 md:gap-10 group">
                    <div className="absolute left-0 w-8 h-8 md:w-10 md:h-10 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center z-10 group-hover:border-emerald-500 transition-colors shadow-sm">
                      <div className="w-1.5 h-1.5 bg-slate-300 group-hover:bg-emerald-500 rounded-full"></div>
                    </div>
                    <div className="pl-6 md:pl-14">
                      <time className="text-[10px] font-black text-emerald-600 uppercase mb-1 block tracking-tighter">
                        {step.date ? new Date(step.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "In Progress"}
                      </time>
                      <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-1">{step.step}</h4>
                      <p className="text-sm md:text-base text-slate-500 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* GALLERY - RESPONSIVE GRID */}
            {batch.images?.length > 0 && (
              <section className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-3 px-1">
                  <ImageIcon size={18} className="text-slate-400" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Visual Documentation</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-6">
                  {batch.images.map((img, i) => (
                    <div key={i} className="overflow-hidden rounded-2xl md:rounded-[2.5rem] bg-slate-200 aspect-square md:aspect-[4/3] border border-slate-200">
                      <img src={img} alt="Batch record" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN (SIDEBAR) */}
          <div className="lg:col-span-4 space-y-6 md:space-y-8">
            
            {/* GEOGRAPHY CARD */}
            <div className="bg-slate-900 text-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                  <Globe className="text-emerald-400" size={18} />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Geographic Origin</h3>
                </div>
                
                <div className="space-y-6 md:space-y-8">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Source Village</p>
                    <p className="text-xl md:text-2xl font-bold leading-tight">{batch.origin?.location}</p>
                    <p className="text-slate-400 text-sm">{batch.origin?.state}, {batch.origin?.country}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Altitude</p>
                      <p className="text-base md:text-lg font-bold flex items-center gap-1.5">
                        <Mountain size={14} className="text-emerald-400" /> {batch.origin?.altitude}m
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Coordinates</p>
                      <p className="text-[10px] font-mono text-slate-300 truncate">{batch.origin?.lat}, {batch.origin?.lng}</p>
                    </div>
                  </div>
                </div>
              </div>
              <Navigation size={150} className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none" />
            </div>

            {/* MAP VIEW - MOBILE FRIENDLY */}
            {batch.origin?.lat && batch.origin?.lng && (
              <div className="bg-white border border-slate-200 rounded-3xl md:rounded-[2.5rem] p-3 md:p-4 shadow-sm">
                <div className="rounded-2xl md:rounded-[1.8rem] overflow-hidden border border-slate-100 h-[200px] md:h-[250px] z-0">
                  <MapContainer
                    center={[batch.origin.lat, batch.origin.lng]}
                    zoom={13}
                    zoomControl={false}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[batch.origin.lat, batch.origin.lng]} />
                  </MapContainer>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${batch.origin.lat},${batch.origin.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full mt-3 py-3 text-[11px] font-black uppercase text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <MapPin size={14} /> View Farm on Google Maps <ExternalLink size={12} />
                </a>
              </div>
            )}

            {/* CULTIVATOR CARD */}
            <div className="bg-white border border-slate-200 rounded-3xl md:rounded-[2.5rem] p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0">
                  {batch.farmer?.image ? (
                    <img src={batch.farmer.image} alt="Farmer" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">👨‍🌾</div>
                  )}
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Producer</p>
                  <h4 className="text-lg md:text-xl font-black text-slate-900 leading-tight">{batch.farmer?.name}</h4>
                  <p className="text-xs text-slate-500 font-bold">{batch.farmer?.village}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between group cursor-pointer">
                 <span className="text-[10px] font-black uppercase text-slate-400">View Farmer Profile</span>
                 <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* SPECS LIST */}
            <div className="bg-white border border-slate-200 rounded-3xl md:rounded-[2.5rem] p-6 md:p-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Product Specifications</h4>
              <div className="space-y-4">
                <DataRow icon={<Calendar size={14} />} label="Harvest" value={batch.harvestSeason} />
                <DataRow icon={<Droplets size={14} />} label="Processing" value={batch.processingMethod} />
                <DataRow icon={<Package size={14} />} label="Packaging" value={batch.packagingType} />
                <DataRow icon={<Info size={14} />} label="Stock" value={`${batch.totalUnits} Units`} />
              </div>
            </div>

            {/* VIDEO LINK */}
            {batch.videoUrl && (
              <a href={batch.videoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-5 md:p-6 bg-emerald-600 rounded-3xl text-white shadow-lg shadow-emerald-100 hover:scale-[1.02] transition-all active:scale-95">
                <PlayCircle size={28} />
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase opacity-80">Documentation</p>
                  <p className="font-bold">Watch Production Video</p>
                </div>
                <ExternalLink size={18} className="opacity-60" />
              </a>
            )}
          </div>
        </div>

        {/* --- STORY FOOTER --- */}
        <section className="mt-16 md:mt-24 border-t border-slate-200 pt-12 md:pt-16 pb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm border border-slate-100 mb-6">
            <Info className="text-emerald-600" size={24} />
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">The Soul of the Batch</h3>
          <p className="text-base md:text-xl text-slate-500 leading-relaxed font-medium italic px-2">
            "{batch.story}"
          </p>
        </section>
      </main>
    </div>
  );
}

// Fixed Row Component for mobile
function DataRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 gap-4">
      <div className="flex items-center gap-2.5 text-slate-400 shrink-0">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-xs md:text-sm font-black text-slate-900 capitalize truncate">
        {value}
      </span>
    </div>
  );
}