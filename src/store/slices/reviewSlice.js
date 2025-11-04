import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    isLoading: false,
    reviews: [],
    allReviews: [],
    error: null,
    success: false,
    message: null, // use this to store toast messages
  },
  reducers: {
    addProductReviewStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.message = null;
    },
    addProductReviewSuccess: (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.reviews = action.payload.reviews || state.reviews;
      state.message = action.payload.message || "Review added successfully!";
    },
    addProductReviewFail: (state, action) => {
      state.isLoading = false;
      state.success = false;
      state.error = action.payload?.error || action.payload || "Something went wrong";
      state.message = action.payload?.message || action.payload || "Something went wrong";
    },
    getProductReviewStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.message = null;
    },
    getProductReviewSuccess: (state, action) => {
      state.isLoading = false;
      state.reviews = action.payload.reviews || action.payload || [];
      state.message = action.payload.message || null;
    },
    getProductReviewFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.error || action.payload || "Failed to fetch reviews";
      state.message = action.payload?.message || action.payload || "Failed to fetch reviews";
    },
    getAllReviewsStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.message = null;
    },
    getAllReviewsSuccess: (state, action) => {
      state.isLoading = false;
      state.allReviews = action.payload.reviews || action.payload || [];
      state.message = action.payload.message || null;
    },
    getAllReviewsFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.error || action.payload || "Failed to fetch all reviews";
      state.message = action.payload?.message || action.payload || "Failed to fetch all reviews";
    },
  },
});

export const addProductReview = (formData) => (dispatch) => {
  dispatch(reviewSlice.actions.addProductReviewStart());
  return axios
    .post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/review/add-review`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    })
    .then((res) => {
      dispatch(reviewSlice.actions.addProductReviewSuccess(res.data.data));
      return res.data;
    })
    .catch((error) => {
      dispatch(
        reviewSlice.actions.addProductReviewFail(
          error.response?.data || "Failed to add review"
        )
      );
    });
};

export const getProductReviews = (productId) => (dispatch) => {
  dispatch(reviewSlice.actions.getProductReviewStart());
  return axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/review/get-review/${productId}`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(reviewSlice.actions.getProductReviewSuccess(res.data.data));
    })
    .catch((error) => {
      dispatch(
        reviewSlice.actions.getProductReviewFail(
          error.response?.data || "Failed to fetch reviews"
        )
      );
    });
};

export const getAllReviews = () => (dispatch) => {
  dispatch(reviewSlice.actions.getAllReviewsStart());
  return axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/review/get-all-reviews`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(reviewSlice.actions.getAllReviewsSuccess(res.data.data));
    })
    .catch((error) => {
      dispatch(
        reviewSlice.actions.getAllReviewsFail(
          error.response?.data?.message || error.message
        )
      );
    });
};

export default reviewSlice.reducer;
