import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const storeProductsSlice = createSlice({
  name: "storeProducts",
  initialState: {
    loading: false,
    error: null,
    message: null,
    productList: [],
  },
  reducers: {
    /* ---------------- ADD PRODUCT ---------------- */
    addStoreProductStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addStoreProductSuccess: (state, action) => {
      state.loading = false;
      state.message = "Product added successfully";
      state.productList.unshift(action.payload.product);
    },
    addStoreProductFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    /* ---------------- GET PRODUCTS ---------------- */
    fetchStoreProductStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStoreProductSuccess: (state, action) => {
      state.loading = false;
      state.productList = action.payload;
    },
    fetchStoreProductFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    /* ---------------- SELL PRODUCT ---------------- */
    sellProductStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    sellProductSuccess: (state, action) => {
      state.loading = false;
      state.message = "Sale successful";

      const { sku, quantity } = action.payload;

      state.productList.forEach((product) => {
        product.variants.forEach((v) => {
          if (v.sku === sku) {
            v.stock -= quantity;
          }
        });

        product.totalStock = product.variants.reduce(
          (sum, v) => sum + (v.stock || 0),
          0
        );
      });
    },
    sellProductFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    /* ---------------- RESTOCK ---------------- */
    restockStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    restockSuccess: (state, action) => {
      state.loading = false;
      state.message = "Stock updated";

      const { sku, quantity } = action.payload;

      state.productList.forEach((product) => {
        product.variants.forEach((v) => {
          if (v.sku === sku) {
            v.stock += quantity;
          }
        });

        product.totalStock = product.variants.reduce(
          (sum, v) => sum + (v.stock || 0),
          0
        );
      });
    },
    restockFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    /* ---------------- DELETE ---------------- */
    deleteStoreProductStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteStoreProductSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.productList = state.productList.filter(
        (p) => p._id !== action.payload.id
      );
    },
    deleteStoreProductFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearMessage: (state) => {
      state.message = null;
    },
  },
});

export default storeProductsSlice.reducer;

export const {
  addStoreProductStart,
  addStoreProductSuccess,
  addStoreProductFailed,
  fetchStoreProductStart,
  fetchStoreProductSuccess,
  fetchStoreProductFailed,
  sellProductStart,
  sellProductSuccess,
  sellProductFailed,
  restockStart,
  restockSuccess,
  restockFailed,
  deleteStoreProductStart,
  deleteStoreProductSuccess,
  deleteStoreProductFailed,
  clearMessage,
} = storeSlice.actions;


export const addStoreProduct = (formData) => async (dispatch) => {
  dispatch(addStoreProductStart());
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/store-products/add`,
      formData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    dispatch(addStoreProductSuccess(res.data));

  } catch (error) {
    dispatch(addStoreProductFailed(error.response?.data?.message));
  }
};

export const fetchStoreProducts = (storeId) => async (dispatch) => {
  dispatch(fetchStoreProductStart());
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/store-products/products?storeId=${storeId}`
    );

    dispatch(fetchStoreProductSuccess(res.data.products));

  } catch (error) {
    dispatch(fetchStoreProductFailed(error.response?.data?.message));
  }
};
export const sellStoreProduct = (data) => async (dispatch) => {
  dispatch(sellProductStart());
  try {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/store-products/sell`,
      data
    );

    dispatch(sellProductSuccess(data));

  } catch (error) {
    dispatch(sellProductFailed(error.response?.data?.message));
  }
};
export const restockProduct = (data) => async (dispatch) => {
  dispatch(restockStart());
  try {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/store-products/restock`,
      data
    );

    dispatch(restockSuccess(data));

  } catch (error) {
    dispatch(restockFailed(error.response?.data?.message));
  }
};
export const deleteStoreProduct = (id) => async (dispatch) => {
  dispatch(deleteStoreProductStart());
  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/store-products/delete/${id}`
    );

    dispatch(
      deleteStoreProductSuccess({
        message: res.data.message,
        id,
      })
    );

  } catch (error) {
    dispatch(deleteStoreProductFailed(error.response?.data?.message));
  }
};

