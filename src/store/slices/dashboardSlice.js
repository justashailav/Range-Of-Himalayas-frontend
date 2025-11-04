import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        loading: false,
        stats: {
            ordersToday: 0,
            ordersThisWeek: 0,
            revenueToday: 0,
            revenueThisMonth: 0,
            totalUsers: 0,
            totalStock: 0,
        },
        error: null,
    },
    reducers: {
        getDashboardStatsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        getDashboardStatsSuccess: (state, action) => {
            state.loading = false;
            state.stats = action.payload.data;
        },
        getDashboardStatsFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

export const getDashboardStats = () => (dispatch) => {
    dispatch(dashboardSlice.actions.getDashboardStatsStart());

    return axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/dashboard`, {
        headers: {
            "Content-Type": "application/json"
        },
        withCredentials: true,
    })
        .then((res) => {
            dispatch(dashboardSlice.actions.getDashboardStatsSuccess(res.data));
        })
        .catch((error) => {
            const message = error.response?.data?.message || error.message;
            dispatch(dashboardSlice.actions.getDashboardStatsFailed(message));
        });
};

export default dashboardSlice.reducer;
