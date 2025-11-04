import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import logo from "../../assets/logo-himalayas-black.jpg";
import {
  getOrderDetailsForAdmin,
  getAllOrdersForAllUsers,
  updateOrderStatus,
  approveReturnRequest,
} from "@/store/slices/orderSlice";
import { toast } from "react-toastify";
import {
  MapPin,
  Home,
  Phone,
  FileText,
  User,
  Printer,
  Box,
} from "lucide-react";
import QRCode from "qrcode";
import axios from "axios";
import { getUserById } from "@/store/slices/authSlice";
export default function AdminOrderDetailsView() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const orderDetails = useSelector((state) => state.orders.orderDetails);
  const [userName, setUserName] = useState("");
  const [formData, setFormData] = useState({ status: "" });
  const printRef = useRef();

  useEffect(() => {
    if (orderId) dispatch(getOrderDetailsForAdmin(orderId));
  }, [dispatch, orderId]);

  useEffect(() => {
    if (orderDetails?.orderStatus)
      setFormData({ status: orderDetails.orderStatus });
  }, [orderDetails]);

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    dispatch(
      updateOrderStatus({ id: orderDetails._id, orderStatus: formData.status })
    )
      .then((data) => {
        if (data?.success) {
          dispatch(getOrderDetailsForAdmin(orderDetails._id));
          dispatch(getAllOrdersForAllUsers());
          toast.success("Order status updated successfully");
        } else toast.error("Failed to update order status");
      })
      .catch(() => toast.error("Something went wrong"));
  };
  useEffect(() => {
    if (orderDetails?.userId) {
      dispatch(getUserById(orderDetails.userId)).then((res) => {
        if (res?.user?.name) {
          setUserName(res.user.name);
        } else {
          setUserName("Unknown User");
        }
      });
    }
  }, [dispatch, orderDetails?.userId]);

  const handleReturnApproval = (index, approve) => {
    dispatch(approveReturnRequest(orderDetails._id, index, approve))
      .then((res) => {
        if (res?.success) {
          dispatch(getOrderDetailsForAdmin(orderDetails._id));
          toast.success(
            `Return request ${approve ? "approved" : "rejected"} successfully`
          );
        } else toast.error("Failed to process return request");
      })
      .catch(() => toast.error("Something went wrong"));
  };

  const handlePrint = async () => {
  const qrDataUrl = await QRCode.toDataURL(
    `https://rangeofhimalayas.com/order/${orderDetails._id}`
  );

  const itemSubtotal =
    orderDetails?.cartItems?.reduce(
      (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0),
      0
    ) || 0;

  const boxSubtotal =
    orderDetails?.boxes?.reduce((total, box) => {
      const boxTotal = box.items?.reduce((sum, item) => {
        const product =
          productList?.find((p) => p._id === item.productId) || {};
        const pricePerPiece =
          (product.customBoxPrices || []).find((p) => p.size === item.size)
            ?.pricePerPiece || 0;
        return sum + Number(pricePerPiece) * Number(item.quantity || 0);
      }, 0);
      return total + boxTotal;
    }, 0) || 0;

  const subtotal = itemSubtotal + boxSubtotal;
  const deliveryCharge = Number(orderDetails?.deliveryCharge || 0);
  const grandTotal = Number(orderDetails?.totalAmount || subtotal + deliveryCharge);

  // ✅ Detect if coupon applied (total less than subtotal + delivery)
  const couponApplied = grandTotal < subtotal + deliveryCharge;

  const printWindow = window.open("", "", "width=400,height=600");
  printWindow.document.write(`
  <html>
    <head>
      <title>Order Slip - ${orderDetails._id}</title>
      <style>
        @page { size: auto; margin: 5mm; }
        body {
          font-family: "Poppins", Arial, sans-serif;
          font-size: 12px;
          color: #222;
          margin: 0;
          padding: 0;
          background: #fff;
        }

        .receipt {
          width: 280px;
          margin: auto;
          padding: 10px;
        }

        .header {
          text-align: center;
          border-bottom: 1px dashed #aaa;
          padding-bottom: 5px;
        }

        .header img {
          width: 60px;
          margin-bottom: 4px;
        }

        .brand {
          font-size: 15px;
          font-weight: bold;
          color: #2d572c;
        }

        .details {
          text-align: center;
          font-size: 11px;
          color: #555;
          margin-top: 2px;
        }

        .section {
          margin-top: 10px;
          border-bottom: 1px dashed #ccc;
          padding-bottom: 5px;
        }

        .section h3 {
          font-size: 12px;
          color: #2d572c;
          margin-bottom: 3px;
        }

        .item,
        .box-item {
          display: flex;
          justify-content: space-between;
          margin: 3px 0;
          font-size: 11px;
        }

        .item-name,
        .box-item-name {
          flex: 1;
          color: #333;
        }

        .item-price,
        .box-item-price {
          text-align: right;
        }

        .box-header {
          font-weight: 600;
          margin-top: 6px;
          color: #333;
          font-size: 12px;
        }

        .totals {
          text-align: right;
          margin-top: 8px;
          font-size: 11px;
        }

        .totals p {
          margin: 1px 0;
        }

        .coupon-applied {
          text-align: right;
          font-size: 11px;
          color: #2d572c;
          margin-top: 5px;
        }

        .qr {
          text-align: center;
          margin-top: 10px;
        }

        .qr img {
          width: 70px;
          height: 70px;
        }

        .thanks {
          text-align: center;
          font-size: 11px;
          color: #777;
          margin-top: 8px;
        }

        .signature {
          text-align: center;
          margin-top: 10px;
          font-size: 10px;
        }

        .signature-line {
          border-top: 1px solid #333;
          width: 120px;
          margin: 10px auto 3px;
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <img src="${logo}" alt="Logo" />
          <div class="brand">Range of Himalayas</div>
          <div class="details">
            Shimla, Himachal Pradesh<br>
            +91 6230867344 | contactrangeofhimalayas@gmail.com
          </div>
        </div>

        <div class="section">
          <h3>Shipping To</h3>
          <p>${userName || orderDetails?.user?.name || "Customer Name"}</p>
          <p>${orderDetails?.addressInfo?.address || ""}</p>
          <p>${orderDetails?.addressInfo?.city || ""}</p>
          <p>${orderDetails?.addressInfo?.pincode || ""}</p>
          <p>${orderDetails?.addressInfo?.phone || ""}</p>
          <p>${orderDetails?.addressInfo?.notes || ""}</p>
        </div>

        <div class="section">
          <h3>Items</h3>
          ${
            orderDetails?.cartItems
              ?.map((item) => {
                const product =
                  productList?.find((p) => p._id === item.productId) || {};
                const name = product?.title || "Unknown Product";
                const total = (
                  Number(item.price || 0) * Number(item.quantity || 0)
                ).toFixed(2);
                return `
                  <div class="item">
                    <div class="item-name">${name} (${
      item.size || "-"
    }) (${item.weight || "-"}) × ${item.quantity}</div>
                    <div class="item-price">₹${total}</div>
                  </div>`;
              })
              .join("") || "<div>No items</div>"
          }
        </div>

        ${
          orderDetails?.boxes?.length
            ? `
          <div class="section">
            <h3>Box Items</h3>
            ${orderDetails.boxes
              .map((box) => {
                const boxTotal = box.items?.reduce((sum, item) => {
                  const product =
                    productList?.find((p) => p._id === item.productId) || {};
                  const pricePerPiece =
                    (product.customBoxPrices || []).find(
                      (p) => p.size === item.size
                    )?.pricePerPiece || 0;
                  return sum + pricePerPiece * item.quantity;
                }, 0);

                return `
                    <div class="box-header">${
                      box.boxName || "Custom Box"
                    } (Total ₹${boxTotal.toFixed(2)})</div>
                    ${box.items
                      .map((item) => {
                        const product =
                          productList?.find(
                            (p) => p._id === item.productId
                          ) || {};
                        const name = product?.title || "Unknown Product";
                        const pricePerPiece =
                          (product.customBoxPrices || []).find(
                            (p) => p.size === item.size
                          )?.pricePerPiece || 0;
                        const total = (pricePerPiece * item.quantity).toFixed(
                          2
                        );
                        return `
                          <div class="box-item">
                            <div class="box-item-name">${name} (${
      item.size || "-"
    }) × ${item.quantity}</div>
                            <div class="box-item-price">₹${total}</div>
                          </div>`;
                      })
                      .join("")}`;
              })
              .join("")}
          </div>`
            : ""
        }

        <div class="totals">
          <p><b>Items Total:</b> ₹${itemSubtotal.toFixed(2)}</p>
          <p><b>Boxes Total:</b> ₹${boxSubtotal.toFixed(2)}</p>
          <p><b>Delivery:</b> ₹${deliveryCharge.toFixed(2)}</p>
          ${
            couponApplied
              ? `<p><b>Coupon Discount:</b> -₹${(
                  subtotal +
                  deliveryCharge -
                  grandTotal
                ).toFixed(2)}</p>`
              : ""
          }
          <p><b>Grand Total:</b> ₹${grandTotal.toFixed(2)}</p>
        </div>

        ${
          couponApplied
            ? `<div class="coupon-applied">✅ Coupon Applied</div>`
            : ""
        }

        <div class="qr">
          <img src="${qrDataUrl}" alt="QR Code" />
          <div style="font-size:10px;color:#555;">Scan to view your order</div>
        </div>

        <div class="signature">
          <div class="signature-line"></div>
          Authorized Signature
        </div>

        <div class="thanks">
          Thank you for shopping with <b>Range of Himalayas!</b><br>
          Visit: www.rangeofhimalayas.co.in
        </div>
      </div>
    </body>
  </html>`);

  printWindow.document.close();
  printWindow.print();
};

  if (!orderDetails)
    return (
      <p className="text-center mt-20 text-gray-500 text-lg">Loading...</p>
    );

  return (
    <div className="min-h-screen bg-[#FFF8E1] p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-end">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            <Printer size={18} /> Print Details
          </button>
        </div>

        <section className="bg-[#FDFDFD] shadow-md rounded-2xl border border-gray-200 p-6">
          <h2 className="text-2xl font-bold mb-5 border-b border-gray-200 pb-3">
            Order Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
            {[
              ["Order ID", orderDetails._id],
              ["Order Date", orderDetails.orderDate?.split("T")[0]],
              ["Order Price", `₹${orderDetails.totalAmount}`],
              ["Payment Method", orderDetails.paymentMethod],
              ["Payment Status", orderDetails.paymentStatus],
              ["Cancel Status", orderDetails.cancelStatus],
              ["Refund Status", orderDetails.refundStatus],
              ["Return Status", orderDetails.returnStatus || "none"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between border-b border-gray-200 py-2"
              >
                <span className="font-medium text-gray-600">{label}</span>
                <span className="text-gray-900">{value || "-"}</span>
              </div>
            ))}

            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-600">Order Status</span>
              <Badge
                className={`py-1 px-4 rounded-full text-white font-semibold text-sm ${
                  orderDetails.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails.orderStatus === "packed"
                    ? "bg-yellow-500"
                    : orderDetails.orderStatus === "cancelled"
                    ? "bg-red-500"
                    : orderDetails.orderStatus === "delivered"
                    ? "bg-blue-500"
                    : "bg-gray-400"
                }`}
              >
                {orderDetails.orderStatus || "-"}
              </Badge>
            </div>
          </div>
          <form onSubmit={handleUpdateStatus} className="mt-4 space-y-3">
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="block w-full rounded-md border border-gray-300 p-2"
              required
            >
              <option value="">Select status</option>
              <option value="confirmed">Confirmed</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Update Status
            </button>
          </form>
        </section>
        <div ref={printRef}>
          <section className="bg-[#FDFDFD] shadow-md rounded-2xl border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-5 border-b border-gray-200 pb-3">
              Shipping Information
            </h2>

            {orderDetails?.addressInfo ? (
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-primary" />
                  <span className="text-gray-900">
                    {userName || "Loading..."}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={18} className="text-primary" />
                  <span>{orderDetails.addressInfo.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Home size={18} className="text-primary" />
                  <span>{orderDetails.addressInfo.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-primary" />
                  <span>
                    {orderDetails.addressInfo.city} -{" "}
                    {orderDetails.addressInfo.pincode},{" "}
                    {orderDetails.addressInfo.state}
                  </span>
                </div>

                {orderDetails.addressInfo.notes && (
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-primary" />
                    <span>{orderDetails.addressInfo.notes}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                No shipping info available.
              </p>
            )}
          </section>
          {orderDetails.boxes?.length > 0 && (
            <section className="bg-white shadow-md rounded-2xl border border-gray-200 p-6 mt-10">
              <h3 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-3 flex items-center gap-2">
                <Box className="text-orange-500" /> Boxes in this Order
              </h3>

              {orderDetails.boxes.map((box, boxIndex) => (
                <div
                  key={boxIndex}
                  className="mb-6 p-4 border border-gray-200 rounded-xl bg-[#FAFAFA] shadow-sm"
                >
                  <h4 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
                    📦 Box #{boxIndex + 1} — {box.boxType || "Custom Box"}
                  </h4>

                  {box.items?.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {box.items.map((item, i) => {
                        const product =
                          productList.find((p) => p._id === item.productId) ||
                          {};
                        const price =
                          (product.customBoxPrices?.find(
                            (p) => p.size === item.size
                          )?.pricePerPiece || 0) * item.quantity;

                        return (
                          <li
                            key={item._id || i}
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors gap-3"
                          >
                            {/* Product Info */}
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images?.[0] || "/placeholder.png"}
                                alt={product.title || "Unknown Product"}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-gray-200"
                              />
                              <div className="flex flex-col">
                                <span className="font-semibold text-gray-900 text-sm sm:text-base truncate max-w-[220px]">
                                  {product.title || "Unknown Product"}
                                </span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  <span className="text-gray-700 text-sm">
                                    Qty:{" "}
                                    <span className="font-medium">
                                      {item.quantity}
                                    </span>
                                  </span>
                                  <span className="bg-blue-100 text-blue-800 text-sm px-2 py-0.5 rounded-full font-medium">
                                    Size: {item.size || "-"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {/* Price */}
                            <span className="mt-2 sm:mt-0 text-gray-900 font-semibold text-sm sm:text-base">
                              ₹{price}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm italic">
                      No items in this box.
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}
          <section className="bg-white shadow-sm rounded-2xl border border-gray-200 p-6 mt-10">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
              🛒 Ordered Items
            </h3>

            {orderDetails.cartItems?.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {orderDetails.cartItems.map((item, idx) => {
                  const product =
                    productList.find((p) => p._id === item.productId) || {};
                  return (
                    <li
                      key={idx}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 px-3 rounded-xl bg-[#FAFAFA] hover:bg-gray-50 transition-all duration-200 mb-2 border border-gray-100"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        {product?.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm border border-gray-200">
                            No Img
                          </div>
                        )}

                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800 text-base line-clamp-1">
                            {product.title}
                          </span>

                          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600">
                            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium">
                              Qty: {item.quantity}
                            </span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium">
                              Size: {item.size || "-"}
                            </span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium">
                              Weight: {item.weight ? `${item.weight} ` : "-"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-0 sm:ml-auto text-right">
                        <span className="text-lg font-semibold text-green-600">
                          ₹{item.price}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500 italic text-center py-4">
                No items found in this order.
              </p>
            )}
          </section>
        </div>
        {orderDetails.returnRequests?.length > 0 && (
          <section className="bg-[#FFFDFD] shadow-md rounded-2xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">
              Return Requests
            </h3>
            <ul className="divide-y divide-gray-100">
              {orderDetails.returnRequests.map((req, idx) => (
                <li
                  key={idx}
                  className="flex flex-col gap-4 py-3 px-4 rounded-lg bg-white hover:bg-gray-50"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-700 font-medium">
                        Reason: {req.reason}
                      </span>
                      <span className="text-gray-600">
                        Status: {req.status}
                      </span>
                      <span className="text-gray-500 text-sm">
                        Requested At:{" "}
                        {new Date(req.requestedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {req.status === "requested" && (
                      <div className="flex gap-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                          onClick={() => handleReturnApproval(idx, true)}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                          onClick={() => handleReturnApproval(idx, false)}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 overflow-x-auto mt-2">
                    {req.photos?.map((photo, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 flex flex-col items-center"
                      >
                        <img
                          src={photo}
                          alt={`Return photo ${i + 1}`}
                          className="w-40 h-40 object-cover rounded-md border"
                        />
                        <span className="text-sm text-gray-500 mt-1">
                          Photo {i + 1}
                        </span>
                      </div>
                    ))}

                    {req.videos?.map((video, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 flex flex-col items-center"
                      >
                        <video
                          src={video}
                          controls
                          className="w-40 h-40 object-cover rounded-md border"
                        />
                        <span className="text-sm text-gray-500 mt-1">
                          Video {i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
