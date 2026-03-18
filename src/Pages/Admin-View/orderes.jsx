import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { getAllOrdersForAllUsers } from "@/store/slices/orderSlice";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Package,
  Truck,
  Search,
  User,
  Filter,
  ChevronRight,
  IndianRupee,
  Activity,
  Calendar,
  CreditCard,
  ArrowUpRight
} from "lucide-react";

export default function AdminOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderList, isLoading } = useSelector((state) => state.orders);

  // Filters State
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchOrderId, setSearchOrderId] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (dateFilter !== "all") params.append("filter", dateFilter);
    if (statusFilter !== "all") params.append("status", statusFilter);
    if (searchOrderId) params.append("orderId", searchOrderId);
    if (customerFilter) params.append("customer", customerFilter);
    if (paymentStatus !== "all") params.append("paymentStatus", paymentStatus);
    if (minAmount) params.append("minAmount", minAmount);
    if (maxAmount) params.append("maxAmount", maxAmount);
    params.append("paymentMethod", "Online");

    dispatch(getAllOrdersForAllUsers(params.toString()));
  }, [dispatch, dateFilter, statusFilter, searchOrderId, customerFilter, paymentStatus, minAmount, maxAmount]);

  const getStatusBadgeColor = (status) => {
    const styles = {
      confirmed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      packed: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      shipping: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      delivered: "bg-teal-500/10 text-teal-600 border-teal-500/20",
      cancelled: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    };
    return styles[status?.toLowerCase()] || "bg-stone-100 text-stone-600 border-stone-200";
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] p-6 md:p-12 font-sans text-stone-900">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* --- CINEMATIC HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-rose-500 uppercase">
              <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>System Operational</span>
            </div>
            <h1 className="text-5xl font-extralight tracking-tighter text-stone-950">
              Logistics <span className="font-serif italic text-stone-400">Control</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-8 bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div className="text-right">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Active Shipments</p>
              <p className="text-3xl font-light leading-none">{orderList?.length || 0}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-stone-950 flex items-center justify-center text-white shadow-lg">
              <Package size={22} strokeWidth={1.5} />
            </div>
          </div>
        </header>

        {/* --- SMART FILTERS PANEL --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-8">
            {/* Time Horizon */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] ml-1">Time Horizon</h3>
              <div className="flex flex-wrap gap-2">
                {["all", "today", "yesterday", "week", "month"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setDateFilter(f)}
                    className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all duration-500 border tracking-tight ${
                      dateFilter === f 
                      ? "bg-stone-950 text-white border-stone-950 shadow-xl translate-y-[-2px]" 
                      : "bg-white text-stone-400 border-stone-100 hover:border-stone-300"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] ml-1">Process Status</h3>
              <div className="flex flex-wrap gap-2">
                {["all", "confirmed", "packed", "shipping", "delivered"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                      statusFilter === s 
                      ? "bg-rose-50 text-rose-600 border-rose-200 shadow-sm" 
                      : "bg-transparent text-stone-400 border-transparent hover:text-stone-600"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Card className="lg:col-span-8 border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.02)] rounded-[2.5rem] p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Identification</label>
                <div className="relative group">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-rose-500 transition-colors" size={16} />
                  <Input
                    placeholder="Search by Order ID..."
                    className="pl-7 bg-transparent border-none border-b border-stone-100 rounded-none focus-visible:ring-0 focus-visible:border-rose-500 transition-all placeholder:text-stone-300"
                    onChange={(e) => setSearchOrderId(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Customer Entity</label>
                <div className="relative group">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-rose-500 transition-colors" size={16} />
                  <Input
                    placeholder="Name or Email..."
                    className="pl-7 bg-transparent border-none border-b border-stone-100 rounded-none focus-visible:ring-0 focus-visible:border-rose-500 transition-all placeholder:text-stone-300"
                    onChange={(e) => setCustomerFilter(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Financial Range</label>
                <div className="flex items-center gap-3">
                   <Input
                    type="number"
                    placeholder="Min ₹"
                    className="bg-stone-50 border-none rounded-xl h-10 text-xs focus-visible:ring-1 focus-visible:ring-stone-200"
                    onChange={(e) => setMinAmount(e.target.value)}
                  />
                  <span className="text-stone-200">—</span>
                  <Input
                    type="number"
                    placeholder="Max ₹"
                    className="bg-stone-50 border-none rounded-xl h-10 text-xs focus-visible:ring-1 focus-visible:ring-stone-200"
                    onChange={(e) => setMaxAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Payment</label>
                <select
                  className="w-full bg-stone-50 border-none rounded-xl h-10 text-xs px-3 outline-none focus:ring-1 focus:ring-stone-200 transition-all appearance-none cursor-pointer text-stone-600"
                  onChange={(e) => setPaymentStatus(e.target.value)}
                >
                  <option value="all">All Transactions</option>
                  <option value="paid">Settled</option>
                  <option value="pending">Awaiting</option>
                </select>
              </div>
            </div>
          </Card>
        </section>

        {/* --- PREMIUM DATA TABLE --- */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-stone-100 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="animate-spin text-stone-200" size={40} strokeWidth={1} />
              <p className="text-[10px] font-bold tracking-[0.4em] text-stone-400 uppercase">Synchronizing</p>
            </div>
          ) : orderList?.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-stone-50/50">
                  <TableRow className="hover:bg-transparent border-stone-100">
                    <TableHead className="h-16 px-10 text-stone-400 font-bold text-[10px] uppercase tracking-[0.2em]">Reference</TableHead>
                    <TableHead className="text-stone-400 font-bold text-[10px] uppercase tracking-[0.2em]">Temporal Record</TableHead>
                    <TableHead className="text-stone-400 font-bold text-[10px] uppercase tracking-[0.2em]">Process</TableHead>
                    <TableHead className="text-stone-400 font-bold text-[10px] uppercase tracking-[0.2em] text-right">Settlement</TableHead>
                    <TableHead className="text-center"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderList.map((order) => (
                    <TableRow key={order._id} className="group hover:bg-stone-50/50 transition-all duration-500 border-stone-50">
                      <TableCell className="py-8 px-10">
                        <div className="flex flex-col">
                          <span className="text-stone-900 font-bold text-sm tracking-tight capitalize">
                            #{order._id.slice(-8)}
                          </span>
                          <span className="text-[9px] text-stone-300 font-mono mt-1 uppercase tracking-tighter">ID: {order._id}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-8">
  <div className="flex items-center gap-6 group/date">
    {/* Large Date Number using createdAt */}
    <span className="text-4xl font-extralight text-stone-900 tracking-tighter leading-none border-r border-stone-100 pr-6 group-hover/date:border-rose-400 transition-colors duration-500">
      {order?.createdAt 
        ? new Date(order.createdAt).getDate().toString().padStart(2, '0') 
        : "--"}
    </span>

    <div className="flex flex-col -space-y-1">
      {/* Month and Year using createdAt */}
      <span className="text-[10px] font-black text-stone-800 uppercase tracking-[0.3em]">
        {order?.createdAt 
          ? new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) 
          : "PENDING"}
      </span>
      
      {/* Subtext with dynamic time for that "Logistics" feel */}
      <span className="text-[11px] font-medium text-stone-400 italic font-serif mt-1">
        Logged at {order?.createdAt 
          ? new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase() 
          : "System Entry"}
      </span>
    </div>
  </div>
</TableCell>

                      <TableCell>
                        <Badge className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border shadow-none ${getStatusBadgeColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right pr-10">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center text-stone-950 font-bold text-lg tracking-tighter">
                            <IndianRupee size={14} className="text-stone-300 mr-0.5" />
                            {order.totalAmount.toLocaleString('en-IN')}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <CreditCard size={10} className="text-stone-300" />
                            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.2em]">{order.paymentStatus || "Paid"}</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-center pr-10">
                        <Button
                          variant="ghost"
                          onClick={() => navigate(`/admin/order-details/${order._id}`, { state: { orderDetails: order } })}
                          className="h-12 w-12 rounded-full hover:bg-white hover:shadow-xl transition-all group/btn border border-transparent hover:border-stone-100"
                        >
                          <ArrowUpRight className="text-stone-300 group-hover/btn:text-rose-500 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all" size={20} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-48">
              <div className="h-20 w-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-stone-100">
                <Truck size={32} className="text-stone-200" strokeWidth={1} />
              </div>
              <h3 className="text-stone-950 font-serif italic text-2xl">Archive Clear</h3>
              <p className="text-stone-400 text-sm mt-2 max-w-xs mx-auto font-light leading-relaxed">
                No transactions recorded within the selected parameters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}