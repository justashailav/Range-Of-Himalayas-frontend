import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    coupons: [],
    loading: false,
    error: null,
    success: false,
    discountAmount: null,
    finalAmount: null,
    code: null,
    message:null
  },
  reducers: {
    createCouponStart(state) {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    createCouponSuccess(state, action) {
      state.loading = false;
      state.coupons.push(action.payload);
      state.success = true;
    },
    createCouponFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    getAllCouponsStart(state) {
      state.loading = true;
      state.error = null;
    },
    getAllCouponsSuccess(state, action) {
      state.loading = false;
      state.coupons = action.payload.coupons;
    },
    getAllCouponsFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteCouponStart(state) {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    deleteCouponSuccess(state, action) {
      state.loading = false;
      state.success = true;
      state.coupons = state.coupons.filter(
        (coupon) => coupon._id !== action.payload
      );
    },
    deleteCouponFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    applyCouponStart(state) {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.discountAmount = null;
      state.finalAmount = null;
      state.code = null;
    },
    applyCouponSuccess(state, action) {
      state.loading = false;
      state.success = true;
      state.discountAmount = action.payload.discountAmount;
      state.finalAmount = action.payload.finalPrice;
      state.code = action.payload.code;
      state.message = action.payload.message;
    },
    applyCouponFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.discountAmount = null;
      state.finalAmount = null;
      state.code = null;
      state.message = null;
    },
    editCouponStart(state) {
      state.loading = true;
      state.error = null;
    },
    editCouponSuccess(state, action) {
      state.loading = false;
      const index = state.coupons.findIndex(
        (coupon) => coupon._id === action.payload.coupon._id
      );
      if (index !== -1) {
        state.coupons[index] = action.payload.coupon;
      }
    },
    editCouponFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetCoupon(state) {
      state.discountAmount = null;
      state.finalAmount = null;
      state.code = null;
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
});
export const { resetCoupon } = couponSlice.actions;

export const createCoupon = (couponData) => async (dispatch) => {
  dispatch(couponSlice.actions.createCouponStart());
  return axios
    .post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/create-coupon`, couponData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
    .then((res) => {
      dispatch(couponSlice.actions.createCouponSuccess(res.data.coupon));
      return res.data;
    })
    .catch((error) => {
      const message = error.response?.data?.message || error.message;
      dispatch(couponSlice.actions.createCouponFailed(message));
      return Promise.reject(message);
    });
};

export const getAllCoupons = () => async (dispatch) => {
  dispatch(couponSlice.actions.getAllCouponsStart());
  return axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/get-coupons`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
    .then((res) => {
      dispatch(couponSlice.actions.getAllCouponsSuccess(res.data));
      return res.data;
    })
    .catch((error) => {
      const message = error.response?.data?.message || error.message;
      dispatch(couponSlice.actions.getAllCouponsFailed(message));
      return Promise.reject(message);
    });
};

export const deleteCoupon = (id) => async (dispatch) => {
  dispatch(couponSlice.actions.deleteCouponStart());
  return axios
    .delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/${id}`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
    .then(() => {
      dispatch(couponSlice.actions.deleteCouponSuccess(id));
    })
    .catch((error) => {
      const message = error.response?.data?.message || error.message;
      dispatch(couponSlice.actions.deleteCouponFailed(message));
      return Promise.reject(message);
    });
};
export const applyCoupon = ({ code, orderAmount, userId }) => async (dispatch) => {
  dispatch(couponSlice.actions.applyCouponStart());
  return axios
    .post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/apply-coupon`,
      { code, orderAmount, userId },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    )
    .then((res) => {
      dispatch(couponSlice.actions.applyCouponSuccess(res.data));
      return res.data;
    })
    .catch((error) => {
      const message = error.response?.data?.message || error.message;
      dispatch(couponSlice.actions.applyCouponFailed(message));
      return { success: false, message };
    });
};

export const editCoupon = ({ id, formData }) => async (dispatch) => {
  dispatch(couponSlice.actions.editCouponStart());
  return axios
    .put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/edit-coupon/${id}`, formData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
    .then((res) => {
      dispatch(couponSlice.actions.editCouponSuccess(res.data));
    })
    .catch((error) => {
      const message = error.response?.data?.message || error.message;
      dispatch(couponSlice.actions.editCouponFailed(message));
    });
};

export default couponSlice.reducer;
