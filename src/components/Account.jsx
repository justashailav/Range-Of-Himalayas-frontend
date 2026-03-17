import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/Pages/Address";
import ShoppingOrders from "./Orders";
import { Helmet } from "react-helmet";
import { User, Package, MapPin, Settings } from "lucide-react";

export default function ShoppingAccount() {
  return (
    <div className="min-h-screen bg-[#FCFAF7]">
      <Helmet>
        <title>Account — Range Of Himalayas</title>
        <meta
          name="description"
          content="Manage your Himalayan heritage orders and delivery addresses."
        />
      </Helmet>

      {/* Cinematic Header Section */}
      <div className="bg-white border-b border-stone-200/60 pt-12 pb-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[10px] font-black text-[#B23A2E] tracking-[0.3em] uppercase mb-3 block">
                Member Dashboard
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight uppercase">
                My Account
              </h1>
            </div>
            
            {/* Quick Stats or Welcome Message */}
            <div className="flex gap-8 border-t md:border-t-0 border-stone-100 pt-6 md:pt-0">
              <div>
                <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mb-1">Status</p>
                <p className="text-sm font-bold text-stone-800 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Himalayan Member
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <Tabs defaultValue="orders" className="w-full space-y-10">
          
          {/* High-End Minimalist Tab List */}
          <div className="flex justify-center md:justify-start">
            <TabsList className="bg-transparent h-auto p-0 gap-8 flex-wrap justify-center md:justify-start">
              <TabsTrigger 
                value="orders" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-stone-900 data-[state=active]:border-stone-900 border-b-2 border-transparent rounded-none px-0 pb-4 text-stone-400 font-bold text-[11px] tracking-[0.2em] uppercase transition-all"
              >
                <Package className="w-3.5 h-3.5 mr-2 inline-block mb-0.5" />
                Order History
              </TabsTrigger>
              <TabsTrigger 
                value="address" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-stone-900 data-[state=active]:border-stone-900 border-b-2 border-transparent rounded-none px-0 pb-4 text-stone-400 font-bold text-[11px] tracking-[0.2em] uppercase transition-all"
              >
                <MapPin className="w-3.5 h-3.5 mr-2 inline-block mb-0.5" />
                Shipping Addresses
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Content Sections with subtle fade-in */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <TabsContent value="orders" className="outline-none">
              <div className="bg-white border border-stone-200/60 rounded-2xl p-6 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <ShoppingOrders />
              </div>
            </TabsContent>
            
            <TabsContent value="address" className="outline-none">
              <div className="bg-white border border-stone-200/60 rounded-2xl p-6 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <Address />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}