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
  Search,
  User,
  Filter,
  ChevronRight,
  IndianRupee,
  Activity,
  ArrowUpRight,
} from "lucide-react";

export default function AdminOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderList, isLoading } = useSelector((state) => state.orders);

  // Filters State
  const [dateFilter, setDateFilter] = useState("all");
  const [searchOrderId, setSearchOrderId] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // Trigger fetch whenever any filter changes
  useEffect(() => {
    const fetchOrders = () => {
      const params = new URLSearchParams();
      
      // Date logic
      if (dateFilter !== "all") params.append("filter", dateFilter);
      
      // Other filters
      if (searchOrderId) params.append("orderId", searchOrderId);
      if (customerFilter) params.append("customer", customerFilter);
      if (paymentStatus !== "all") params.append("paymentStatus", paymentStatus);
      if (minAmount) params.append("minAmount", minAmount);
      if (maxAmount) params.append("maxAmount", maxAmount);
      
      // Hardcoded constant for this view
      params.append("paymentMethod", "Online");

      dispatch(getAllOrdersForAllUsers(params.toString()));
    };

    fetchOrders();
  }, [dispatch, dateFilter, searchOrderId, customerFilter, paymentStatus, minAmount, maxAmount]);

  const getStatusBadgeColor = (status) => {
    const styles = {
      confirmed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      packed: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      shipping: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      delivered: "bg-teal-500/10 text-teal-600 border-teal-500/20",
      cancelled: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    };
    return styles[status?.toLowerCase()] || "bg-stone-100 text-stone-500 border-stone-200";
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] p-6 md:p-12 font-sans text-stone-900">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-rose-500 uppercase">
              <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>Live Logistics Engine</span>
            </div>
            <h1 className="text-5xl font-extralight tracking-tighter text-stone-950">
              Order <span className="font-serif italic text-stone-400 font-normal">Manifest</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-1">Total Volume</p>
              <p className="text-3xl font-light tracking-tighter">{orderList?.length || 0}</p>
            </div>
            <div className="h-12 w-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-900 shadow-sm">
              <Package size={20} strokeWidth={1.5} />
            </div>
          </div>
        </header>

        {/* --- FILTER INTERFACE --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
            {/* Horizontal Timeline Filter */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Filter size={12} /> Time Horizon
              </h3>
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

            {/* Financial Range */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Settlement Range</h3>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  placeholder="Min"
                  className="bg-transparent border-none border-b border-stone-200 rounded-none focus-visible:ring-0 focus-visible:border-rose-500 transition-all px-0"
                  onChange={(e) => setMinAmount(e.target.value)}
                />
                <span className="text-stone-300">/</span>
                <Input
                  type="number"
                  placeholder="Max"
                  className="bg-transparent border-none border-b border-stone-200 rounded-none focus-visible:ring-0 focus-visible:border-rose-500 transition-all px-0"
                  onChange={(e) => setMaxAmount(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Search Inputs */}
          <Card className="lg:col-span-8 border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.02)] rounded-[2rem] p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Identification</label>
                <div className="relative group">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-rose-500 transition-colors" size={16} />
                  <Input
                    placeholder="Search by Order ID..."
                    className="pl-7 bg-transparent border-none border-b border-stone-100 rounded-none focus-visible:ring-0 focus-visible:border-rose-500 transition-all"
                    onChange={(e) => setSearchOrderId(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Customer Entity</label>
                <div className="relative group">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-rose-500 transition-colors" size={16} />
                  <Input
                    placeholder="Name or Email..."
                    className="pl-7 bg-transparent border-none border-b border-stone-100 rounded-none focus-visible:ring-0 focus-visible:border-rose-500 transition-all"
                    onChange={(e) => setCustomerFilter(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* --- DATA ARCHIVE --- */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="animate-spin text-stone-200" size={40} strokeWidth={1} />
              <p className="text-[10px] font-bold tracking-[0.4em] text-stone-400 uppercase">Indexing manifested data</p>
            </div>
          ) : orderList?.length > 0 ? (
            <Table>
              <TableHeader className="bg-stone-50/40">
                <TableRow className="hover:bg-transparent border-stone-100">
                  <TableHead className="h-16 px-10 text-stone-400 font-bold text-[10px] uppercase tracking-[0.2em]">Reference</TableHead>
                  <TableHead className="text-stone-400 font-bold text-[10px] uppercase tracking-[0.2em]">Temporal Record</TableHead>
                  <TableHead className="text-stone-400 font-bold text-[10px] uppercase tracking-[0.2em]">Logistics</TableHead>
                  <TableHead className="text-stone-400 font-bold text-[10px] uppercase tracking-[0.2em] text-right">Revenue</TableHead>
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
                        <span className="text-[9px] text-stone-300 font-mono mt-1 uppercase">Sys-ID: {order._id.slice(0, 8)}...</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-8">
                      <div className="flex items-center gap-6 group/date">
                        <span className="text-4xl font-extralight text-stone-900 tracking-tighter leading-none border-r border-stone-100 pr-6 group-hover/date:border-rose-400 transition-colors duration-500">
                          {order?.createdAt ? new Date(order.createdAt).getDate().toString().padStart(2, '0') : "--"}
                        </span>
                        <div className="flex flex-col -space-y-1">
                          <span className="text-[10px] font-black text-stone-800 uppercase tracking-[0.3em]">
                            {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : "PENDING"}
                          </span>
                          <span className="text-[11px] font-medium text-stone-400 italic font-serif mt-1">
                            {order?.createdAt ? new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase() : ""}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border shadow-none ${getStatusBadgeColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex flex-col items-end pr-4">
                        <div className="flex items-center text-stone-950 font-bold text-lg tracking-tighter">
                          <IndianRupee size={14} className="text-stone-300 mr-0.5" />
                          {order.totalAmount.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.2em] mt-1">Paid Online</span>
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
          ) : (
            <div className="text-center py-48">
              <div className="h-20 w-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-stone-100">
                <Activity size={32} className="text-stone-200" />
              </div>
              <h3 className="text-stone-950 font-serif italic text-2xl">Manifest Clear</h3>
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