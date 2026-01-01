import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/Pages/Address";
import ShoppingOrders from "./Orders";
import { Helmet } from "react-helmet";

export default function ShoppingAccount() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>My Account | Range Of Himalayas</title>
        <meta
          name="description"
          content="Manage your orders, addresses, and account details at Range Of Himalayas."
        />
      </Helmet>

      {/* ===== HEADER ===== */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-extrabold">My Account</h1>
          <p className="text-white/90 mt-1">
            View your orders and manage delivery addresses
          </p>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <Tabs defaultValue="orders" className="grid grid-cols-1 md:grid-cols-4">

            {/* ===== SIDEBAR TABS ===== */}
            <TabsList className="md:col-span-1 flex md:flex-col bg-gray-100 p-4 gap-2">
              <TabsTrigger
                value="orders"
                className="w-full justify-start px-4 py-3 rounded-lg text-left data-[state=active]:bg-white data-[state=active]:shadow"
              >
                📦 My Orders
              </TabsTrigger>

              <TabsTrigger
                value="address"
                className="w-full justify-start px-4 py-3 rounded-lg text-left data-[state=active]:bg-white data-[state=active]:shadow"
              >
                🏠 My Addresses
              </TabsTrigger>
            </TabsList>

            {/* ===== CONTENT AREA ===== */}
            <div className="md:col-span-3 p-6 md:p-8">

              {/* ORDERS */}
              <TabsContent value="orders" className="mt-0">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">My Orders</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Track, view, and manage your recent purchases
                  </p>
                </div>
                <ShoppingOrders />
              </TabsContent>

              {/* ADDRESS */}
              <TabsContent value="address" className="mt-0">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Saved Addresses</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Manage your delivery locations
                  </p>
                </div>
                <Address />
              </TabsContent>

            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
