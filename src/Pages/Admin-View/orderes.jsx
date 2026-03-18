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
} from "lucide-react";

export default function AdminOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderList, isLoading } = useSelector((state) => state.orders);

  // Filters State
  const [dateFilter, setDateFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchOrderId, setSearchOrderId] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (dateFilter !== "all") params.append("filter", dateFilter);
    if (productFilter && productFilter !== "all") params.append("title", productFilter);
    if (statusFilter !== "all") params.append("status", statusFilter);
    if (searchOrderId) params.append("orderId", searchOrderId);
    if (customerFilter) params.append("customer", customerFilter);
    if (paymentStatus !== "all") params.append("paymentStatus", paymentStatus);
    if (minAmount) params.append("minAmount", minAmount);
    if (maxAmount) params.append("maxAmount", maxAmount);
    params.append("paymentMethod", "Online");

    dispatch(getAllOrdersForAllUsers(params.toString()));
  }, [dispatch, dateFilter, productFilter, statusFilter, searchOrderId, customerFilter, paymentStatus, minAmount, maxAmount]);

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
    <div className="min-h-screen bg-[#F8F7F5] p-6 md:p-12 font-sans text-stone-900">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* --- CINEMATIC HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-rose-500 uppercase">
              <Activity size={12} />
              <span>System Operational</span>
            </div>
            <h1 className="text-5xl font-extralight tracking-tighter text-stone-950">
              Logistics <span className="font-serif italic text-stone-400">Control</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-6 bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
            <div className="h-12 w-12 rounded-xl bg-stone-950 flex items-center justify-center text-white shadow-lg">
              <Package size={22} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-2xl font-semibold leading-none">{orderList?.length || 0}</p>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Active Shipments</p>
            </div>
          </div>
        </header>

        {/* --- SMART FILTERS PANEL --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.15em] ml-1">Time Horizon</h3>
              <div className="flex flex-wrap gap-2">
                {["all", "today", "week", "month"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setDateFilter(f)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 border ${
                      dateFilter === f 
                      ? "bg-stone-900 text-white border-stone-900 shadow-md translate-y-[-1px]" 
                      : "bg-white text-stone-500 border-stone-100 hover:border-stone-300"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Financial Range</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  className="bg-white border-none shadow-sm rounded-xl focus-visible:ring-rose-500/20"
                  onChange={(e) => setMinAmount(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  className="bg-white border-none shadow-sm rounded-xl focus-visible:ring-rose-500/20"
                  onChange={(e) => setMaxAmount(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Card className="lg:col-span-9 border-none shadow-sm bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Search Identifier</label>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-rose-500 transition-colors" size={16} />
                  <Input
                    placeholder="Order ID..."
                    className="pl-11 bg-white border-stone-100 rounded-xl h-11 focus-visible:ring-rose-500/10"
                    onChange={(e) => setSearchOrderId(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Customer</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-rose-500 transition-colors" size={16} />
                  <Input
                    placeholder="Name/Email"
                    className="pl-11 bg-white border-stone-100 rounded-xl h-11 focus-visible:ring-rose-500/10"
                    onChange={(e) => setCustomerFilter(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Payment Status</label>
                <select
                  className="w-full rounded-xl border border-stone-100 bg-white h-11 text-sm px-4 outline-none focus:ring-2 focus:ring-rose-500/10 transition-all appearance-none cursor-pointer"
                  onChange={(e) => setPaymentStatus(e.target.value)}
                >
                  <option value="all">All Transactions</option>
                  <option value="paid">Settled</option>
                  <option value="pending">Awaiting</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* --- PREMIUM DATA TABLE --- */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-100 to-stone-200 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <Card className="relative border-none shadow-2xl rounded-[1.5rem] bg-white overflow-hidden">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                  <Loader2 className="animate-spin text-rose-500" size={32} strokeWidth={1.5} />
                  <p className="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase">Synchronizing</p>
                </div>
              ) : orderList?.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-stone-50/50">
                      <TableRow className="hover:bg-transparent border-stone-100">
                        <TableHead className="h-14 px-8 text-stone-400 font-bold text-[10px] uppercase tracking-[0.2em]">Reference</TableHead>
                        <TableHead className="text-stone-400 font-bold text-[10px] uppercase tracking-[0.2em]">Timestamp</TableHead>
                        <TableHead className="text-stone-400 font-bold text-[10px] uppercase tracking-[0.2em]">Logistics</TableHead>
                        <TableHead className="text-stone-400 font-bold text-[10px] uppercase tracking-[0.2em] text-right">Settlement</TableHead>
                        <TableHead className="text-stone-400 font-bold text-[10px] uppercase tracking-[0.2em] text-center">Detail</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderList.map((order) => (
                        <TableRow key={order._id} className="group hover:bg-stone-50/80 transition-all duration-300 border-stone-50">
                          <TableCell className="py-6 px-8">
                            <div className="flex flex-col gap-1">
                              <span className="font-mono text-[11px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded w-fit capitalize">
                                {order._id.slice(-8)}
                              </span>
                              <span className="text-stone-400 text-[10px] tracking-tight truncate max-w-[100px]">{order._id}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-stone-900 font-semibold text-sm">
                                {order?.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : "Pending"}
                              </span>
                              <span className="text-[10px] text-stone-400 font-medium">
                                {order?.orderDate ? new Date(order.orderDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border shadow-none ${getStatusBadgeColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-stone-950 font-bold text-base flex items-center tracking-tighter">
                                <IndianRupee size={14} className="mr-0.5 text-stone-300" />
                                {order.totalAmount.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">Confirmed</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              onClick={() => navigate(`/admin/order-details/${order._id}`, { state: { orderDetails: order } })}
                              className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-stone-100 group/btn"
                            >
                              <ChevronRight className="text-stone-300 group-hover/btn:text-rose-500 transition-colors" size={20} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-40">
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-stone-50 mb-6 border border-stone-100">
                    <Truck size={36} className="text-stone-200" strokeWidth={1} />
                  </div>
                  <h3 className="text-stone-900 font-serif italic text-xl">Archive is empty</h3>
                  <p className="text-stone-400 text-sm mt-2 max-w-sm mx-auto font-light leading-relaxed">
                    No records found matching your current refinement parameters.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}