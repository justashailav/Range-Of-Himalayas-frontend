import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { getAllOrdersByUserId } from "@/store/slices/orderSlice";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export default function ShoppingOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { orderList, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersByUserId(user._id));
    }
  }, [dispatch, user?._id]);

  if (!user) {
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">
        Please login to view orders.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8E1] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Order History
        </h1>

        <Card className="shadow-lg rounded-2xl border border-gray-200">
          <CardContent>
            {error && <p className="text-red-600 mb-4">{error}</p>}

            {/* ✅ Responsive handling */}
            <div className="hidden md:block overflow-x-auto">
              <Table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
                <TableHeader className="bg-gray-200">
                  <TableRow>
                    <TableHead className="px-4 py-2 text-gray-700">
                      Order ID
                    </TableHead>
                    <TableHead className="px-4 py-2 text-gray-700">
                      Order Date
                    </TableHead>
                    <TableHead className="px-4 py-2 text-gray-700">
                      Status
                    </TableHead>
                    <TableHead className="px-4 py-2 text-gray-700">
                      Total Amount
                    </TableHead>
                    <TableHead className="px-4 py-2 text-gray-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orderList?.length > 0 ? (
                    orderList.map((order, idx) => (
                      <TableRow
                        key={order._id}
                        className={`transition-colors duration-150 ${
                          idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100`}
                      >
                        <TableCell className="px-4 py-3 font-medium text-gray-800">
                          {order._id}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          {order.orderDate.split("T")[0]}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge
                            className={`py-1 px-3 rounded-full text-white text-sm font-semibold ${
                              order.orderStatus === "confirmed"
                                ? "bg-green-500"
                                : order.orderStatus === "packed"
                                ? "bg-blue-500"
                                : order.orderStatus === "shipping"
                                ? "bg-yellow-400"
                                : order.orderStatus === "delivered"
                                ? "bg-teal-500"
                                : order.orderStatus === "rejected" ||
                                  order.orderStatus === "cancelled"
                                ? "bg-red-600"
                                : "bg-gray-500"
                            }`}
                          >
                            {order.orderStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 font-semibold">
                          ₹{order.totalAmount}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                            onClick={() =>
                              navigate(`/order-details/${order._id}`, {
                                state: { orderDetails: order },
                              })
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                          >
                            View Details
                          </Button>
                          
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-6 text-gray-500"
                      >
                        No orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* ✅ Mobile Card Layout */}
            <div className="md:hidden space-y-4">
              {orderList?.length > 0 ? (
                orderList.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-500">
                        {order.orderDate.split("T")[0]}
                      </p>
                      <Badge
                        className={`py-1 px-3 rounded-full text-white text-xs font-semibold ${
                          order.orderStatus === "confirmed"
                            ? "bg-green-500"
                            : order.orderStatus === "packed"
                            ? "bg-blue-500"
                            : order.orderStatus === "shipping"
                            ? "bg-yellow-400"
                            : order.orderStatus === "delivered"
                            ? "bg-teal-500"
                            : order.orderStatus === "rejected" ||
                              order.orderStatus === "cancelled"
                            ? "bg-red-600"
                            : "bg-gray-500"
                        }`}
                      >
                        {order.orderStatus}
                      </Badge>
                    </div>

                    <p className="text-gray-800 font-medium text-sm truncate">
                      Order ID: {order._id}
                    </p>
                    <p className="text-gray-900 font-bold mt-2">
                      ₹{order.totalAmount}
                    </p>

                    <Button
                      onClick={() =>
                        navigate(`/order-details/${order._id}`, {
                          state: { orderDetails: order },
                        })
                      }
                      className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      View Details
                    </Button>
                    
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-6">
                  No orders found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
