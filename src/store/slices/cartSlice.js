import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    loading: false,
    error: null,
    message: null,
    cartItems: [],
    boxes: [],         
  },
  reducers: {
    addToCartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addToCartSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.cartItems = action.payload.cart.items;
    },
    addToCartFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch cart items
    fetchCartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCartSuccess: (state, action) => {
      state.loading = false;
      state.cartItems = action.payload.data?.items || [];
      state.boxes = action.payload.data?.boxes || [];  
    },
    fetchCartFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update cart
    updateCartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateCartSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message || "Cart updated";
      state.cartItems = action.payload.data?.items || [];
    },
    updateCartFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteCartItemStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteCartItemSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.success ? "Item deleted successfully" : "";
      state.cartItems = action.payload.data?.items || [];
    },
    deleteCartItemFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.boxes = [];
      state.message = "Cart cleared";
    },
    addBoxStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addBoxSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.boxes = action.payload.cart.boxes;
    },
    addBoxFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteBoxStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteBoxSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.success ? "Box deleted successfully" : "";
      state.boxes = action.payload.data?.boxes || [];
    },
    deleteBoxFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const addToCart =
  ({ userId, productId, quantity, size, weight }) =>
  async (dispatch) => {
    dispatch(cartSlice.actions.addToCartStart());
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/add`,
        { userId, productId, quantity, size, weight },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      dispatch(cartSlice.actions.addToCartSuccess(res.data));
      return res.data;
    } catch (error) {
      dispatch(
        cartSlice.actions.addToCartFailed(
          error.response?.data?.message || error.message
        )
      );
      return Promise.reject(error.response?.data?.message || error.message);
    }
  };

export const fetchCartItems = (userId) => async (dispatch) => {
  dispatch(cartSlice.actions.fetchCartStart());
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/get/${userId}`, { withCredentials: true });
    dispatch(cartSlice.actions.fetchCartSuccess(res.data));
  } catch (error) {
    dispatch(cartSlice.actions.fetchCartFailed(error.response?.data?.message || error.message));
  }
};

export const updateCart =
  ({ userId, productId, quantity, size,weight }) =>
  async (dispatch) => {
    dispatch(cartSlice.actions.updateCartStart());
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/update-cart`,
        { userId, productId, quantity, size,weight },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      dispatch(cartSlice.actions.updateCartSuccess(res.data));
      return res.data;
    } catch (error) {
      dispatch(cartSlice.actions.updateCartFailed(error.response?.data?.message || error.message));
      return { success: false, message: error.response?.data?.message || "Update failed" };
    }
  };

export const deleteCartItem =
  ({ userId, productId, size,weight }) =>
  async (dispatch) => {
    dispatch(cartSlice.actions.deleteCartItemStart());
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/${userId}/${productId}`, {
        data: { size,weight },
        withCredentials: true,
      });
      dispatch(cartSlice.actions.deleteCartItemSuccess(res.data));
      return res.data;
    } catch (error) {
      dispatch(cartSlice.actions.deleteCartItemFailed(error.response?.data?.message || error.message));
      throw error;
    }
  };

// Add box thunk
export const addBoxToCartThunk =
  ({ userId, id }) =>
  async (dispatch) => {
    dispatch(cartSlice.actions.addBoxStart());
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/add-box`,
        { userId, id },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      dispatch(cartSlice.actions.addBoxSuccess(res.data));
      return res.data;
    } catch (error) {
      dispatch(cartSlice.actions.addBoxFailed(error.response?.data?.message || "Failed to add box"));
      throw error;
    }
  };

// Delete box thunk
export const deleteBoxFromCartThunk =
  ({ userId, boxId }) =>
  async (dispatch) => {
    dispatch(cartSlice.actions.deleteBoxStart());
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/delete-box`,
        { userId, boxId },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      dispatch(cartSlice.actions.deleteBoxSuccess(res.data));
      return res.data;
    } catch (error) {
      dispatch(cartSlice.actions.deleteBoxFailed(error.response?.data?.message || "Failed to delete box"));
      throw error;
    }
  };


export default cartSlice.reducer;
