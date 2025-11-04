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
} from "lucide-react";

export default function AdminOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderList, isLoading } = useSelector((state) => state.orders);

  // Filters
  const [dateFilter, setDateFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchOrderId, setSearchOrderId] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // Fetch with filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (dateFilter !== "all") params.append("filter", dateFilter);
    if (productFilter && productFilter !== "all")
      params.append("title", productFilter);
    if (statusFilter !== "all") params.append("status", statusFilter);
    if (searchOrderId) params.append("orderId", searchOrderId);
    if (customerFilter) params.append("customer", customerFilter);
    if (paymentStatus !== "all") params.append("paymentStatus", paymentStatus);
    if (minAmount) params.append("minAmount", minAmount);
    if (maxAmount) params.append("maxAmount", maxAmount);
    params.append("paymentMethod", "Online"); // always online

    dispatch(getAllOrdersForAllUsers(params.toString()));
  }, [
    dispatch,
    dateFilter,
    productFilter,
    statusFilter,
    searchOrderId,
    customerFilter,
    paymentStatus,
    minAmount,
    maxAmount,
  ]);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border border-green-200";
      case "packed":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "shipping":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "delivered":
        return "bg-teal-100 text-teal-700 border border-teal-200";
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#FFE0B2] p-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Package className="text-[#F08C7D]" size={30} />
            Admin Orders Dashboard
          </h1>
          <div className="hidden sm:flex items-center gap-2 text-gray-600">
            <Filter size={18} />
            <span className="text-sm">Advanced Filters Enabled</span>
          </div>
        </div>

        {/* Filters Panel */}
        <Card className="shadow-md rounded-2xl border border-gray-200 backdrop-blur-sm bg-white/80">
          <CardContent className="p-6 space-y-6">
            {/* Date Filter */}
            <div className="flex flex-wrap gap-2">
              {["all", "today", "yesterday", "week", "month"].map((f) => (
                <Button
                  key={f}
                  onClick={() => setDateFilter(f)}
                  className={`rounded-full text-sm transition-all px-4 py-2 ${
                    dateFilter === f
                      ? "bg-[#F08C7D] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-[#F08C7D]/10"
                  }`}
                >
                  <Calendar size={14} className="mr-2" />
                  {f === "all"
                    ? "All"
                    : f === "today"
                    ? "Today"
                    : f === "yesterday"
                    ? "Yesterday"
                    : f === "week"
                    ? "This Week"
                    : "This Month"}
                </Button>
              ))}
            </div>

            {/* Product Filter */}
            <div className="flex flex-wrap gap-2">
              {[
                "all",
                "Royal Delight Apples",
                "Granny Smith Apples",
                "Golden Apples",
                "Spur Apple",
                "Kiwi",
              ].map((filter) => (
                <Button
                  key={filter}
                  onClick={() =>
                    setProductFilter(filter === "all" ? "" : filter)
                  }
                  className={`rounded-full text-sm transition-all px-4 py-2 ${
                    productFilter === filter
                      ? "bg-[#F08C7D] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-[#F08C7D]/10"
                  }`}
                >
                  {filter === "all" ? "All Products" : filter}
                </Button>
              ))}
            </div>

            {/* Status + Payment */}
            <div className="flex flex-wrap gap-2">
              {[
                "all",
                "confirmed",
                "packed",
                "shipping",
                "delivered",
                "cancelled",
              ].map((status) => (
                <Button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-full text-sm transition-all px-4 py-2 ${
                    statusFilter === status
                      ? "bg-[#F08C7D] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-[#F08C7D]/10"
                  }`}
                >
                  {status === "all"
                    ? "All Status"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>

            {/* Search and Range Inputs */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Order ID */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" />
                <Input
                  placeholder="Search by Order ID"
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  className="pl-10 focus:ring-[#F08C7D]"
                />
              </div>

              {/* Customer */}
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-400" />
                <Input
                  placeholder="Customer name or email"
                  value={customerFilter}
                  onChange={(e) => setCustomerFilter(e.target.value)}
                  className="pl-10 focus:ring-[#F08C7D]"
                />
              </div>

              {/* Payment Status */}
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="rounded-lg border border-gray-300 text-gray-700 px-3 py-2 focus:ring-[#F08C7D]"
              >
                <option value="all">All Payment Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>

              {/* Amount Range */}
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Min ₹"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="focus:ring-[#F08C7D]"
                />
                <span className="text-gray-500">-</span>
                <Input
                  type="number"
                  placeholder="Max ₹"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className="focus:ring-[#F08C7D]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
          <CardContent className="overflow-x-auto p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-600">
                <Loader2 className="animate-spin mb-2" size={32} />
                <p>Loading orders...</p>
              </div>
            ) : orderList?.length > 0 ? (
              <Table className="min-w-[800px] text-sm">
                <TableHeader className="bg-[#F08C7D]/20">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700">
                      Order ID
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderList.map((order, idx) => (
                    <TableRow
                      key={order._id}
                      className={`transition ${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-[#F08C7D]/10`}
                    >
                      <TableCell className="font-medium text-gray-900">
                        {order._id}
                      </TableCell>
                      <TableCell>{order.orderDate.split("T")[0]}</TableCell>
                      <TableCell>
                        <Badge
                          className={`rounded-full px-3 py-1 font-semibold text-xs ${getStatusBadgeColor(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">
                        ₹{order.totalAmount}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <CreditCard size={14} className="text-[#F08C7D]" />
                          Online ({order.paymentStatus || "Paid"})
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() =>
                            navigate(`/admin/order-details/${order._id}`, {
                              state: { orderDetails: order },
                            })
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm rounded-lg px-4 py-2"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <Truck size={40} className="mx-auto mb-3 text-gray-400" />
                <p className="text-lg font-medium">No orders found</p>
                <p className="text-sm text-gray-400">
                  Try adjusting your filters or date range.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
