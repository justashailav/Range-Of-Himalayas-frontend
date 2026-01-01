import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "./ui/card";
import { getAllOrdersByUserId } from "@/store/slices/orderSlice";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

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
      <p className="text-center mt-16 text-gray-500 text-lg">
        Please login to view your orders.
      </p>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            My Orders
          </h1>
          <p className="text-gray-500 mt-1">
            Track and manage your recent purchases
          </p>
        </div>

        {error && (
          <p className="text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}

        {/* ORDERS */}
        {orderList?.length > 0 ? (
          <div className="space-y-4">
            {orderList.map((order) => (
              <Card
                key={order._id}
                className="rounded-2xl border shadow-sm hover:shadow-md transition"
              >
                <CardContent className="p-5 sm:p-6">

                  {/* TOP */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>
                      <p className="font-medium text-gray-800 truncate max-w-xs">
                        {order._id}
                      </p>
                    </div>

                    <Badge
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        statusStyles[order.orderStatus] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.orderStatus}
                    </Badge>
                  </div>

                  {/* MIDDLE */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">
                        Order Date
                      </p>
                      <p className="font-medium">
                        {order.orderDate.split("T")[0]}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Total Amount
                      </p>
                      <p className="font-bold text-green-700">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                  </div>

                  {/* ACTION */}
                  <div className="mt-5 flex justify-end">
                    <Button
                      onClick={() =>
                        navigate(`/order-details/${order._id}`, {
                          state: { orderDetails: order },
                        })
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5"
                    >
                      View Order
                    </Button>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-10 rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg">
              You haven’t placed any orders yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
