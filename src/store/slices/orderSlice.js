import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    isLoading: false,
    orderId: null,
    razorpayOrder: null,
    successMessage: null,
    error: null,
    success: false,
    orderList: [],
    orderDetails: null,
    popupMessage: null,
    recentOrders: [],
  },
  reducers: {
    showPopup(state, action) {
      state.popupMessage = action.payload;
    },
    hidePopup(state) {
      state.popupMessage = null;
    },
    createNewOrderStart(state) {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
      state.success = false;
      state.orderId = null;
      state.razorpayOrder = null;
    },
    createNewOrderSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.success = true;
      state.orderId = action.payload.orderId || null;
      state.razorpayOrder = action.payload.razorpayOrder || null;
      state.successMessage =
        action.payload.message || "Order created successfully";
    },
    createNewOrderFailed(state, action) {
      state.isLoading = false;
      state.error = action.payload || "Failed to create order";
      state.success = false;
      state.successMessage = null;
      state.orderId = null;
      state.razorpayOrder = null;
    },

    capturePaymentStart(state) {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    },
    capturePaymentSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.successMessage =
        action.payload.message || "Payment captured successfully";
      state.orderDetails = action.payload.data || null;
    },
    capturePaymentFailed(state, action) {
      state.isLoading = false;
      state.error = action.payload || "Failed to capture payment";
      state.successMessage = null;
    },
    getAllOrdersStartId(state) {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    },
    getAllOrdersSuccessId(state, action) {
      state.isLoading = false;
      state.error = null;
      state.orderList = action.payload.data || [];
      state.successMessage = "Orders fetched successfully";
    },
    getAllOrdersFailedId(state, action) {
      state.isLoading = false;
      state.error = action.payload || "Failed to fetch orders";
      state.successMessage = null;
      state.orderList = [];
    },
    getOrderDetailsStart(state) {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
      state.orderDetails = null; // clear previous order details
    },
    getOrderDetailsSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.orderDetails = action.payload.data || null;
      state.successMessage = "Order details fetched successfully";
    },
    getOrderDetailsFailed(state, action) {
      state.isLoading = false;
      state.error = action.payload || "Failed to fetch order details";
      state.successMessage = null;
      state.orderDetails = null;
    },
    getAllOrdersStart(state) {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    },
    getAllOrdersSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.successMessage = "All orders fetched successfully";
      state.orderList = action.payload.data || [];
    },
    getAllOrdersFailed(state, action) {
      state.isLoading = false;
      state.error = action.payload || "Failed to fetch all orders";
      state.successMessage = null;
      state.orderList = [];
    },
    getOrderDetailsAdminStart(state) {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
      state.orderDetails = null;
    },
    getOrderDetailsAdminSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.successMessage = "Admin fetched order details successfully";
      state.orderDetails = action.payload.data || null;
    },
    getOrderDetailsAdminFailed(state, action) {
      state.isLoading = false;
      state.error = action.payload || "Failed to fetch order details for admin";
      state.successMessage = null;
      state.orderDetails = null;
    },
    updateOrderStatusStart(state) {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    },

    updateOrderStatusStart(state) {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    },
    updateOrderStatusSuccess(state, action) {
      state.isLoading = false;
      state.successMessage =
        action.payload.message || "Order status updated successfully";
      state.orderDetails = action.payload.data || null;
      state.error = null;
    },
    updateOrderStatusFailed(state, action) {
      state.isLoading = false;
      state.successMessage = null;
      state.error = action.payload || "Failed to update order status";
    },
    cancelOrderStart(state) {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
      state.success = false;
    },
    cancelOrderSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.error = null;
      state.successMessage =
        action.payload.message || "Order cancelled successfully";

      // Update order details if returned
      if (action.payload.data) {
        const updatedOrder = action.payload.data;

        // Update refund status if applicable
        if (updatedOrder.refundStatus) {
          updatedOrder.refundStatus = updatedOrder.refundStatus;
          updatedOrder.refundAmount = updatedOrder.refundAmount;
        }

        // Update order status
        updatedOrder.orderStatus = "cancelled";
        updatedOrder.cancelStatus = "cancelled";

        state.orderDetails = updatedOrder;
      }
    },
    cancelOrderFailed(state, action) {
      state.isLoading = false;
      state.success = false;
      state.error = action.payload || "Failed to cancel order";
      state.successMessage = null;
    },
    cancelOrderItemStart(state) {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    },

    
    requestReturnStart(state) {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    },
    requestReturnSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.success = true;
      state.successMessage = action.payload.message || "Return requested successfully";
      state.orderDetails = action.payload.data || state.orderDetails;
    },
    requestReturnFailed(state, action) {
      state.isLoading = false;
      state.success = false;
      state.successMessage = null;
      state.error = action.payload || "Failed to request return";
    },

    // Admin approve return & process refund
    approveReturnStart(state) {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    },
    approveReturnSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.error = null;
      state.successMessage = action.payload.message || "Return approved and refund processed successfully";
      state.orderDetails = action.payload.data || state.orderDetails;
    },
    approveReturnFailed(state, action) {
      state.isLoading = false;
      state.success = false;
      state.successMessage = null;
      state.error = action.payload || "Failed to approve return";
    },
    getRecentOrdersStart(state) {
  state.isLoading = true;
  state.error = null;
  // Clear previous data while loading
  state.recentOrders = [];
  state.successMessage = null;
},

getRecentOrdersSuccess(state, action) {
  state.isLoading = false;
  state.error = null;

  // Force replace old data (not merge)
  state.recentOrders = Array.isArray(action.payload?.data)
    ? action.payload.data
    : [];

  state.successMessage = "Recent orders fetched successfully";
},

getRecentOrdersFailed(state, action) {
  state.isLoading = false;
  state.error = action.payload || "Failed to fetch recent orders";
  // Ensure data is cleared on error
  state.recentOrders = [];
  state.successMessage = null;
},

    
  },
});

export const createNewOrder = (orderData) => (dispatch) => {
  dispatch(orderSlice.actions.createNewOrderStart());
  return axios
    .post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/order/create`, orderData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((res) => {
      dispatch(orderSlice.actions.createNewOrderSuccess(res.data));
      return res.data;
    })
    .catch((error) => {
      dispatch(
        orderSlice.actions.createNewOrderFailed(error.response?.data?.message)
      );
    });
};

export const capturePayment =
  ({ razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId  }) =>
  (dispatch) => {
    dispatch(orderSlice.actions.capturePaymentStart());
    return axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/order/capture-payment`,
        { razorpay_order_id,razorpay_payment_id, razorpay_signature, orderId   },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        dispatch(orderSlice.actions.capturePaymentSuccess(res.data));
          dispatch(getRecentOrders());
      })
      .catch((error) => {
        console.log("Error response:", error.response);
        console.log("Error response data:", error.response?.data);
        dispatch(
          orderSlice.actions.capturePaymentFailed(error.response?.data?.message)
        );
      });
  };

export const getAllOrdersByUserId = (userId) => (dispatch) => {
  dispatch(orderSlice.actions.getAllOrdersStartId());
  return axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/order/get/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((res) => {
      dispatch(orderSlice.actions.getAllOrdersSuccessId(res.data));
    })
    .catch((error) => {
      dispatch(
        orderSlice.actions.getAllOrdersFailedId(error.response?.data?.message)
      );
    });
};
export const getAllOrderDetails = (id) => (dispatch) => {
  dispatch(orderSlice.actions.getOrderDetailsStart());
  return axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/order/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((res) => {
      dispatch(orderSlice.actions.getOrderDetailsSuccess(res.data));
      return res.data;
    })
    .catch((error) => {
      dispatch(
        orderSlice.actions.getOrderDetailsFailed(error.response?.data?.message)
      );
    });
};

export const getAllOrdersForAllUsers = (filters = {}) => (dispatch) => {
  dispatch(orderSlice.actions.getAllOrdersStart());

  const queryParams = new URLSearchParams(filters).toString();
  const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/order/getallorders${queryParams ? `?${queryParams}` : ""}`;

  return axios
    .get(url, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((res) => {
      console.log("getAllOrdersForAllUsers response:", res.data);
      dispatch(orderSlice.actions.getAllOrdersSuccess(res.data));
    })
    .catch((error) => {
      console.error("Error in getAllOrdersForAllUsers:", error);
      dispatch(
        orderSlice.actions.getAllOrdersFailed(error.response?.data?.message)
      );
    });
};

export const getOrderDetailsForAdmin = (id) => (dispatch) => {
  dispatch(orderSlice.actions.getOrderDetailsAdminStart());
  return axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/order/details/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((res) => {
      dispatch(orderSlice.actions.getOrderDetailsAdminSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        orderSlice.actions.getOrderDetailsAdminFailed(
          error.response?.data?.message
        )
      );
    });
};

export const updateOrderStatus =
  ({ id, orderStatus }) =>
  (dispatch) => {
    dispatch(orderSlice.actions.updateOrderStatusStart());
    return axios
      .put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/order/update/${id}`,
        { orderStatus },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        dispatch(orderSlice.actions.updateOrderStatusSuccess(res.data));
        return res.data;
      })
      .catch((error) => {
        dispatch(
          orderSlice.actions.updateOrderStatusFailed(
            error.response?.data?.message
          )
        );
      });
  };
export const cancelOrder = (id) => (dispatch) => {
  dispatch(orderSlice.actions.cancelOrderStart());
  return axios
    .post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/order/cancel/full/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((res) => {
      dispatch(orderSlice.actions.cancelOrderSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        orderSlice.actions.cancelOrderFailed(error.response?.data?.message)
      );
    });
};

export const requestReturnItems = (orderId, payload) => (dispatch) => {
  dispatch(orderSlice.actions.requestReturnStart());
  return axios
    .post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/order/return/${orderId}`,
      payload,
      { withCredentials: true }
    )
    .then((res) => {
      dispatch(orderSlice.actions.requestReturnSuccess(res.data));
      return res.data;
    })
    .catch((error) => {
      dispatch(orderSlice.actions.requestReturnFailed(error.response?.data?.message));
      throw error;
    });
};


export const approveReturnRequest = ( orderId, requestIndex, approve ) => (dispatch) => {
  dispatch(orderSlice.actions.approveReturnStart());

  return axios
    .post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/order/return/approve/${orderId}`,
      { requestIndex, approve },
      { withCredentials: true }
    )
    .then((res) => {
      dispatch(orderSlice.actions.approveReturnSuccess(res.data));
      return res.data;
    })
    .catch((error) => {
      dispatch(orderSlice.actions.approveReturnFailed(error.response?.data?.message));
      throw error;
    });
};
export const getRecentOrders = () => async (dispatch) => {
  dispatch(orderSlice.actions.getRecentOrdersStart());
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/order/recent`, {
      withCredentials: true,
    });
    dispatch(orderSlice.actions.getRecentOrdersSuccess(res.data));
  } catch (error) {
    dispatch(
      orderSlice.actions.getRecentOrdersFailed(error.response?.data?.message)
    );
  }
};

export default orderSlice.reducer;
