import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const wishListSlice = createSlice({
  name: "wishList",
  initialState: {
    loading: false,
    error: null,
    message: null,
    wishListItems: [],
  },
  reducers: {
    fetchWishListStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchWishListSuccess: (state, action) => {
      state.loading = false;
      state.wishListItems = action.payload.data?.items || [];
    },
    fetchWishListFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    addToWishListStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addToWishListSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.wishListItems = action.payload.data?.items || [];
    },
    addToWishListFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateWishListItemStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateWishListItemSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message || "Wishlist updated";
      state.wishListItems = action.payload.data?.items || [];
    },
    updateWishListItemFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteWishListItemStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteWishListItemSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.success ? "Item deleted successfully" : "";
      state.wishListItems = action.payload.data?.items || [];
    },
    deleteWishListItemFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});


export const fetchWishListItems = (userId) => async (dispatch) => {
  dispatch(wishListSlice.actions.fetchWishListStart());
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/get-wishlist/${userId}`, {
      withCredentials: true,
    });
    console.log("fetchWishListItems response:", res.data);
    dispatch(wishListSlice.actions.fetchWishListSuccess(res.data));
  } catch (error) {
    dispatch(wishListSlice.actions.fetchWishListFailed(error.response?.data?.message || error.message));
  }
};

export const addToWishList =
  ({ userId, productId, quantity, size,weight }) =>
  async (dispatch) => {
    dispatch(wishListSlice.actions.addToWishListStart());
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/add-wishlist`,
        { userId, productId, quantity, size,weight },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("Add to wishlist response:", res.data);
      dispatch(wishListSlice.actions.addToWishListSuccess(res.data));
      return res.data;
    } catch (error) {
      dispatch(wishListSlice.actions.addToWishListFailed(error.response?.data?.message || error.message));
      return Promise.reject(error.response?.data?.message || error.message);
    }
  };

export const updateWishListItemQty =
  ({ userId, productId, quantity, size }) =>
  async (dispatch) => {
    dispatch(wishListSlice.actions.updateWishListItemStart());
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/update-wishlist`,
        { userId, productId, quantity, size },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("updateWishListItemQty response:", res.data);
      dispatch(wishListSlice.actions.updateWishListItemSuccess(res.data));
      return res.data;
    } catch (error) {
      dispatch(wishListSlice.actions.updateWishListItemFailed(error.response?.data?.message || error.message));
      return { success: false, message: error.response?.data?.message || "Update failed" };
    }
  };

export const deleteWishListItem =
  ({ userId, productId, size,weight }) =>
  async (dispatch) => {
    dispatch(wishListSlice.actions.deleteWishListItemStart());
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/wishlist/${userId}/${productId}`,
        {
          data: { size,weight },
          withCredentials: true,
        }
      );
      console.log("deleteWishListItem response:", res.data);
      dispatch(wishListSlice.actions.deleteWishListItemSuccess(res.data));
      return res.data;
    } catch (error) {
      dispatch(wishListSlice.actions.deleteWishListItemFailed(error.response?.data?.message || error.message));
      throw error;
    }
  };

export default wishListSlice.reducer;
