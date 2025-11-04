import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const searchSlice = createSlice({
    name: "search",
    initialState: {
        isLoading: false,
        searchResults: [],
        error: null
    },
    reducers: {
        searchProductsStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        searchProductsSuccess(state, action) {
            state.isLoading = false;
            state.searchResults = action.payload;
            state.error = null;
        },
        searchProductsFail(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        }
    }
});

export const searchProducts = (keyword) => (dispatch) => {
    dispatch(searchSlice.actions.searchProductsStart());
    
    return axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/${keyword}`, {
        headers: {
            "Content-Type": "application/json"
        },
        withCredentials: true
    })
    .then((res) => {
        dispatch(searchSlice.actions.searchProductsSuccess(res.data.data));
    })
    .catch((error) => {
        dispatch(searchSlice.actions.searchProductsFail(error.response?.data?.message || "Something went wrong"));
    });
};

export default searchSlice.reducer;
