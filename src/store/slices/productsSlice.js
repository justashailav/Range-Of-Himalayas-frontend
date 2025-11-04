import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const productsSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    productDetails:null
  },
  reducers:{
    fetchProductsStart: (state) => {
      state.loading = true;
      
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false;
      state.productDetails = action.payload;
    },
    fetchProductsFailed: (state, action) => {
      state.loading = false;
      
    },
  }
});


export const fetchProductDetails = (id) => async (dispatch) => {
  dispatch(productsSlice.actions.fetchProductsStart());
  await axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/get-details/${id}`, {
      withCredentials: true,
    })
    .then((res) => {
      console.log(res.data.product)
      dispatch(productsSlice.actions.fetchProductsSuccess(res.data.product));
    })
    .catch((error) => {
      dispatch(
        productsSlice.actions.fetchProductsFailed(error.response.data.message)
      );
    });
};

export default productsSlice.reducer;