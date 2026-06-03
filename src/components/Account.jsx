import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/Pages/Address";
import ShoppingOrders from "./Orders";
import { Helmet } from "react-helmet";
import { Package, MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import BannerRangeOfHimalayas from "../assets/Banner-RangeOfHimalayas.png"
export default function ShoppingAccount() {
  const { user } = useSelector((state) => state.auth);

  // ✅ Guest Local Data
  const guestOrders =
    JSON.parse(localStorage.getItem("guestOrders")) || [];

  const guestAddresses =
    JSON.parse(localStorage.getItem("guestAddress")) || [];

  const hasGuestData =
    guestOrders.length > 0 || guestAddresses.length > 0;

  return (
    <div className="min-h-screen bg-[#FCFAF7]">
      <Helmet>
        <title>Account — Range Of Himalayas</title>

        <meta
          name="description"
          content="Manage your Himalayan heritage orders and delivery addresses."
        />
      </Helmet>
      <div className="relative h-[250px] md:h-[350px] overflow-hidden">
      <img
        src={BannerRangeOfHimalayas}
        alt="Range Of Himalayas"
        className="w-full h-full"
      />

    
    </div>

      {/* ✅ NO USER + NO GUEST DATA */}
      {!user && !hasGuestData ? (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
          <div className="text-center max-w-xl">
            <span className="text-[10px] font-black text-[#B23A2E] tracking-[0.3em] uppercase mb-3 block">
              Himalayan Archive
            </span>

            <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight uppercase">
              No Records Found
            </h2>

            <p className="mt-5 text-stone-500 text-lg font-serif italic leading-relaxed">
              Your archive is currently empty. Begin your journey into the
              Himalayan harvest collections.
            </p>

            <a
              href="/viewproducts"
              className="
                inline-flex items-center justify-center
                mt-8 px-10 py-4
                bg-stone-900 text-white
                rounded-full
                text-[11px] font-black uppercase tracking-[0.25em]
                hover:bg-[#B23A2E]
                transition-all duration-500
                shadow-xl
              "
            >
              Explore Collection
            </a>
          </div>
        </div>
      ) : (
        <>
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

                {/* STATUS */}
                <div className="flex gap-8 border-t md:border-t-0 border-stone-100 pt-6 md:pt-0">
                  <div>
                    <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mb-1">
                      Status
                    </p>

                    <p className="text-sm font-bold text-stone-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />

                      {user ? "Himalayan Member" : "Guest Explorer"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN */}
          <div className="container mx-auto px-6 py-12">
            <Tabs defaultValue="orders" className="w-full space-y-10">
              {/* TABS */}
              <div className="flex justify-center md:justify-start">
                <TabsList className="bg-transparent h-auto p-0 gap-8 flex-wrap justify-center md:justify-start">
                  <TabsTrigger
                    value="orders"
                    className="
                      data-[state=active]:bg-transparent
                      data-[state=active]:shadow-none
                      data-[state=active]:text-stone-900
                      data-[state=active]:border-stone-900
                      border-b-2 border-transparent
                      rounded-none px-0 pb-4
                      text-stone-400
                      font-bold text-[11px]
                      tracking-[0.2em]
                      uppercase
                      transition-all
                    "
                  >
                    <Package className="w-3.5 h-3.5 mr-2 inline-block mb-0.5" />

                    Order History
                  </TabsTrigger>

                  <TabsTrigger
                    value="address"
                    className="
                      data-[state=active]:bg-transparent
                      data-[state=active]:shadow-none
                      data-[state=active]:text-stone-900
                      data-[state=active]:border-stone-900
                      border-b-2 border-transparent
                      rounded-none px-0 pb-4
                      text-stone-400
                      font-bold text-[11px]
                      tracking-[0.2em]
                      uppercase
                      transition-all
                    "
                  >
                    <MapPin className="w-3.5 h-3.5 mr-2 inline-block mb-0.5" />

                    Shipping Addresses
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* CONTENT */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <TabsContent value="orders" className="outline-none">
                  <div
                    className="
                      bg-white
                      border border-stone-200/60
                      rounded-2xl
                      p-6 md:p-10
                      shadow-[0_4px_20px_rgba(0,0,0,0.02)]
                    "
                  >
                    <ShoppingOrders />
                  </div>
                </TabsContent>

                <TabsContent value="address" className="outline-none">
                  <div
                    className="
                      bg-white
                      border border-stone-200/60
                      rounded-2xl
                      p-6 md:p-10
                      shadow-[0_4px_20px_rgba(0,0,0,0.02)]
                    "
                  >
                    <Address />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
}