import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const productSlice = createSlice({
  name: "products",
  initialState: {
    loading: false,
    productList: [],
    error: null,
    message: null,
  },
  reducers: {
    addProductStart(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addProductSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.productList.push(action.payload.newProduct);
    },
    addProductFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchProductsStart(state) {
      state.loadingFetch = true;
      state.errorFetch = null;
    },
    fetchProductsSuccess(state, action) {
      state.loadingFetch = false;
      state.productList = action.payload;
    },
    fetchProductsFailed(state, action) {
      state.loadingFetch = false;
      state.errorFetch = action.payload;
    },
    editProductStart(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    editProductSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      const index = state.productList.findIndex(
        (p) => p._id === action.payload.product._id
      );
      if (index !== -1) {
        state.productList[index] = action.payload.product;
      }
    },
    editProductFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteProductStart(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteProductSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      // state.productList = state.productList.filter(
      //   (p) => p._id !== action.payload.id
      // );
    },
    deleteProductFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const addProduct = (formData) => async (dispatch) => {
  dispatch(productSlice.actions.addProductStart());
  await axios
    .post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/add`, formData, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(productSlice.actions.addProductSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        productSlice.actions.addProductFailed(error.response.data.message)
      );
    });
};
export const getAllProduct = () => async (dispatch) => {
  dispatch(productSlice.actions.fetchProductsStart());
  await axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/get`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(productSlice.actions.fetchProductsSuccess(res.data.products));
    })
    .catch((error) => {
      dispatch(
        productSlice.actions.fetchProductsFailed(error.response.data.message)
      );
    });
};
export const editProduct = ({id, formData}) => async (dispatch) => {
  dispatch(productSlice.actions.editProductStart());
  await axios
    .put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/edit/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
      withCredentials: true,
    })

    .then((res) => {
      dispatch(productSlice.actions.editProductSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        productSlice.actions.editProductFailed(error.response.data.message)
      );
    });
};
export const deleteProduct = (id) => async (dispatch) => {
  dispatch(productSlice.actions.deleteProductStart());
  await axios
    .delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/delete/${id}`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(productSlice.actions.deleteProductSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        productSlice.actions.deleteProductFailed(error.response.data.message)
      );
    });
};
export default productSlice.reducer;
