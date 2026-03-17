import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/Pages/Address";
import ShoppingOrders from "./Orders";
import { Helmet } from "react-helmet";
import { Package, MapPin, ArrowLeft, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ShoppingAccount() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FCFAF7] selection:bg-[#B23A2E]/10">
      <Helmet>
        <title>Profile — Range Of Himalayas</title>
      </Helmet>

      {/* BACKGROUND DECOR (Subtle Branding) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <h1 className="absolute -bottom-20 -left-20 text-[20vw] font-black uppercase leading-none">
          Range
        </h1>
      </div>

      <div className="relative z-10">
        {/* NAV BAR / HEADER */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200/50">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Store
            </button>
            <div className="flex items-center gap-6">
               <button className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-[#B23A2E] flex items-center gap-2 transition-colors">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            {/* HERO TITLE SECTION */}
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-[#B23A2E]" />
                <span className="text-[11px] font-black text-[#B23A2E] tracking-[0.4em] uppercase">
                  Personal Space
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-stone-900 tracking-tighter uppercase leading-[0.9]">
                Account<br /><span className="text-stone-300">Overview</span>
              </h1>
            </div>

            <Tabs defaultValue="orders" className="w-full">
              <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
                
                {/* SIDEBAR NAVIGATION */}
                <aside className="md:w-64 flex-shrink-0">
                  <TabsList className="flex flex-col h-auto bg-transparent p-0 space-y-2 items-start">
                    <TabsTrigger 
                      value="orders" 
                      className="w-full justify-start gap-4 px-0 py-4 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-stone-900 text-stone-400 border-b border-stone-100 data-[state=active]:border-stone-900 rounded-none transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center transition-colors group-data-[state=active]:bg-stone-900 group-data-[state=active]:text-white">
                        <Package className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest">Orders</span>
                    </TabsTrigger>
                    
                    <TabsTrigger 
                      value="address" 
                      className="w-full justify-start gap-4 px-0 py-4 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-stone-900 text-stone-400 border-b border-stone-100 data-[state=active]:border-stone-900 rounded-none transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center transition-colors group-data-[state=active]:bg-stone-900 group-data-[state=active]:text-white">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest">Shipping</span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-12 p-6 bg-stone-900 rounded-2xl text-white">
                    <p className="text-[9px] font-bold tracking-widest uppercase text-stone-500 mb-2">Need Help?</p>
                    <p className="text-xs font-medium text-stone-300 mb-4">Our Himalayan team is available for you.</p>
                    <button className="text-[10px] font-black uppercase tracking-widest border-b border-stone-700 pb-1 hover:text-[#B23A2E] hover:border-[#B23A2E] transition-all">
                      Support Chat
                    </button>
                  </div>
                </aside>

                {/* MAIN CONTENT AREA */}
                <div className="flex-1">
                  <div className="animate-in fade-in slide-in-from-right-8 duration-1000">
                    <TabsContent value="orders" className="mt-0 outline-none">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xs font-black uppercase tracking-widest text-stone-400">Past & Present Orders</h3>
                        </div>
                        <ShoppingOrders />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="address" className="mt-0 outline-none">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xs font-black uppercase tracking-widest text-stone-400">Delivery Registry</h3>
                        </div>
                        <Address />
                      </div>
                    </TabsContent>
                  </div>
                </div>

              </div>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}