import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/Pages/Address";
import ShoppingOrders from "./Orders";
import { Helmet } from "react-helmet";
export default function ShoppingAccount() {
  return (
    <div className="flex flex-col">
       <Helmet>
        <title>Orders - Range Of Himalayas - Account</title>
        <meta
          name="description"
          content="Range Of Himalayas – Fresh apples, juicy kiwis directly sourced from the Himalayan farms."
        />
      </Helmet>
      <div className="relative h-[300px] w-full overflow-hidden">
        {/* <img
          src={accImg}
          className="h-full w-full object-cover object-center"
        /> */}
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address">
              <Address/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
