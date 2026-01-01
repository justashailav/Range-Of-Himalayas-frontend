import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "./ui/card";
import { getAllOrdersByUserId } from "@/store/slices/orderSlice";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const statusSteps = ["confirmed", "packed", "shipping", "delivered"];

const statusStyles = {
  confirmed: "bg-green-100 text-green-700",
  packed: "bg-blue-100 text-blue-700",
  shipping: "bg-yellow-100 text-yellow-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  rejected: "bg-red-100 text-red-700",
};

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
      <p className="text-center mt-20 text-gray-500 text-lg">
        Please login to view your orders.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            My Orders
          </h1>
          <p className="text-gray-500 mt-1">
            Track your purchases and delivery status
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-600">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {orderList?.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-xl font-semibold text-gray-800">
              No orders yet
            </p>
            <p className="text-gray-500 mt-2">
              Start shopping fresh Himalayan produce 🌿
            </p>
          </div>
        )}

        {/* ORDERS */}
        <div className="space-y-6">
          {orderList?.map((order) => {
            const currentIndex = statusSteps.indexOf(order.orderStatus);

            return (
              <Card
                key={order._id}
                className="rounded-2xl border shadow-sm hover:shadow-md transition"
              >
                <CardContent className="p-6">

                  {/* TOP ROW */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-500">
                        Order ID
                      </p>
                      <p className="font-medium text-gray-800 truncate max-w-xs">
                        {order._id}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {order.orderDate.split("T")[0]}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-lg font-extrabold text-green-700">
                        ₹{order.totalAmount}
                      </p>
                      <Badge
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${
                          statusStyles[order.orderStatus] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.orderStatus}
                      </Badge>
                    </div>
                  </div>

                  {/* STATUS TIMELINE */}
                  {statusSteps.includes(order.orderStatus) && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        {statusSteps.map((step, idx) => (
                          <div
                            key={step}
                            className="flex-1 flex flex-col items-center"
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${
                                idx <= currentIndex
                                  ? "bg-green-600"
                                  : "bg-gray-300"
                              }`}
                            />
                            {idx !== statusSteps.length - 1 && (
                              <div
                                className={`h-[2px] w-full ${
                                  idx < currentIndex
                                    ? "bg-green-600"
                                    : "bg-gray-300"
                                }`}
                              />
                            )}
                            <span className="text-xs mt-2 text-gray-600 capitalize">
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ACTION */}
                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={() =>
                        navigate(`/order-details/${order._id}`, {
                          state: { orderDetails: order },
                        })
                      }
                      className="rounded-xl px-6 bg-gradient-to-r from-blue-600 to-indigo-600
                      hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                    >
                      View Order Details
                    </Button>
                  </div>

                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
