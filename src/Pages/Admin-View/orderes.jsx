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
  Calendar,
  Search,
  User,
  CreditCard,
  Filter,
  ChevronRight,
  IndianRupee,
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
      confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      packed: "bg-amber-50 text-amber-700 border-amber-200",
      shipping: "bg-sky-50 text-sky-700 border-sky-200",
      delivered: "bg-teal-50 text-teal-700 border-teal-200",
      cancelled: "bg-rose-50 text-rose-700 border-rose-200",
      rejected: "bg-rose-50 text-rose-700 border-rose-200",
    };
    return styles[status] || "bg-slate-50 text-slate-700 border-slate-200";
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cinematic Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-8">
          <div>
            <p className="text-[#F08C7D] font-medium tracking-widest uppercase text-xs mb-2">Management Console</p>
            <h1 className="text-4xl font-light text-stone-800 tracking-tight flex items-center gap-3">
              Order <span className="font-semibold text-stone-900">Logistics</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white shadow-sm border border-stone-100 flex items-center justify-center">
                <Package className="text-[#F08C7D]" size={20} />
            </div>
            <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-stone-900">{orderList?.length || 0} Total Orders</p>
                <p className="text-xs text-stone-400">Live Database Access</p>
            </div>
          </div>
        </div>

        {/* Minimalist Filters Panel */}
        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-xl">
          <CardContent className="p-0">
            <div className="p-6 border-b border-stone-50">
                <div className="flex items-center gap-2 mb-4 text-stone-500">
                    <Filter size={14} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Quick Filters</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {["all", "today", "yesterday", "week", "month"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setDateFilter(f)}
                            className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                                dateFilter === f ? "bg-stone-900 text-white shadow-lg" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                            }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-stone-50/30">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter ml-1">Order Identification</label>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-[#F08C7D] transition-colors" size={16} />
                  <Input
                    placeholder="ID e.g. #ORD-102"
                    value={searchOrderId}
                    onChange={(e) => setSearchOrderId(e.target.value)}
                    className="pl-10 bg-white border-stone-200 rounded-lg focus-visible:ring-[#F08C7D]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter ml-1">Customer Search</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-[#F08C7D] transition-colors" size={16} />
                  <Input
                    placeholder="Name or Email"
                    value={customerFilter}
                    onChange={(e) => setCustomerFilter(e.target.value)}
                    className="pl-10 bg-white border-stone-200 rounded-lg focus-visible:ring-[#F08C7D]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter ml-1">Financial Range</label>
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        placeholder="Min"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        className="bg-white border-stone-200 rounded-lg"
                    />
                    <span className="text-stone-300">—</span>
                    <Input
                        type="number"
                        placeholder="Max"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        className="bg-white border-stone-200 rounded-lg"
                    />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter ml-1">Payment Status</label>
                <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-white text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-[#F08C7D]/20 transition-all"
                >
                    <option value="all">All Transactions</option>
                    <option value="paid">Settled</option>
                    <option value="pending">Awaiting</option>
                    <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Table Layout */}
        <Card className="border-none shadow-xl rounded-xl bg-white overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="animate-spin text-[#F08C7D] mb-4" size={40} />
                <p className="text-stone-400 text-sm font-medium tracking-widest uppercase">Syncing Records...</p>
              </div>
            ) : orderList?.length > 0 ? (
              <div className="overflow-x-auto">
                <Table className="min-w-[900px]">
                    <TableHeader className="bg-stone-50 border-b border-stone-100">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="py-5 px-6 text-stone-500 font-bold text-[11px] uppercase tracking-widest">Order Details</TableHead>
                            <TableHead className="text-stone-500 font-bold text-[11px] uppercase tracking-widest">Date & Time</TableHead>
                            <TableHead className="text-stone-500 font-bold text-[11px] uppercase tracking-widest">Logistics Status</TableHead>
                            <TableHead className="text-stone-500 font-bold text-[11px] uppercase tracking-widest text-right">Revenue</TableHead>
                            <TableHead className="text-stone-500 font-bold text-[11px] uppercase tracking-widest text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orderList.map((order) => (
                            <TableRow key={order._id} className="group hover:bg-stone-50/50 transition-colors border-stone-50">
                                <TableCell className="py-6 px-6">
                                    <div className="flex flex-col">
                                        <span className="font-mono text-xs text-[#F08C7D] font-semibold mb-1">#{order._id.slice(-8).toUpperCase()}</span>
                                        <span className="text-stone-400 text-[10px] leading-tight max-w-[120px] truncate">{order._id}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-stone-800 font-medium text-sm">
                                            {order?.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            }) : "Pending"}
                                        </span>
                                        <span className="text-[10px] text-stone-400 font-medium">
                                            {order?.orderDate ? new Date(order.orderDate).toLocaleTimeString('en-IN', {
                                                hour: '2-digit', minute: '2-digit'
                                            }) : ""}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${getStatusBadgeColor(order.orderStatus)} shadow-none`}>
                                        {order.orderStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="text-stone-900 font-bold flex items-center gap-0.5">
                                            <IndianRupee size={12} className="text-stone-400" />
                                            {order.totalAmount}
                                        </span>
                                        <span className="text-[10px] text-stone-400 font-medium italic">Online Payment</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button
                                        variant="ghost"
                                        onClick={() => navigate(`/admin/order-details/${order._id}`, { state: { orderDetails: order } })}
                                        className="h-9 w-9 p-0 rounded-full hover:bg-white hover:shadow-md group/btn border border-transparent hover:border-stone-100"
                                    >
                                        <ChevronRight className="text-stone-300 group-hover/btn:text-[#F08C7D] transition-all" size={20} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-32">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-stone-50 mb-6">
                    <Truck size={32} className="text-stone-200" />
                </div>
                <h3 className="text-stone-800 font-semibold text-lg">Inventory Quiescent</h3>
                <p className="text-stone-400 text-sm max-w-xs mx-auto mt-2 italic">
                  No orders match your current filter parameters. Try expanding your search criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}