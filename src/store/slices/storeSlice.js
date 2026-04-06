import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const storeSlice = createSlice({
  name: "store",
  initialState: {
    loading: false,
    error: null,
    message: null,
    storeList: [],
    selectedStore: null,
    nearestStore: null,
    nearestStores: [],
  },

  reducers: {
    // ✅ CREATE STORE
    createStoreStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createStoreSuccess: (state, action) => {
      state.loading = false;
      state.message = "Store created successfully";
      state.storeList.push(action.payload.data);
    },
    createStoreFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ✅ GET ALL STORES
    fetchStoreStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStoreSuccess: (state, action) => {
      state.loading = false;
      state.storeList = action.payload;
    },
    fetchStoreFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ✅ GET SINGLE STORE
    fetchSingleStoreStart: (state) => {
      state.loading = true;
    },
    fetchSingleStoreSuccess: (state, action) => {
      state.loading = false;
      state.selectedStore = action.payload;
    },
    fetchSingleStoreFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ✅ UPDATE STORE
    updateStoreStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateStoreSuccess: (state, action) => {
      state.loading = false;
      state.message = "Store updated successfully";

      const updated = action.payload.data;
      const index = state.storeList.findIndex((s) => s._id === updated._id);

      if (index !== -1) {
        state.storeList[index] = updated;
      }
    },
    updateStoreFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ✅ DELETE STORE
    deleteStoreStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteStoreSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;

      state.storeList = state.storeList.filter(
        (store) => store._id !== action.payload.storeId,
      );
    },
    deleteStoreFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ✅ NEAREST STORE
    nearestStoreStart: (state) => {
      state.loading = true;
    },
    nearestStoreSuccess: (state, action) => {
      state.loading = false;
      state.nearestStores = action.payload; // 🔥 multiple stores
    },
    nearestStoreFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ✅ TOGGLE STATUS
    toggleStoreStart: (state) => {
      state.loading = true;
    },
    toggleStoreSuccess: (state, action) => {
      state.loading = false;

      const updated = action.payload.data;
      const index = state.storeList.findIndex((s) => s._id === updated._id);

      if (index !== -1) {
        state.storeList[index] = updated;
      }
    },
    toggleStoreFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const createStore = (formData) => async (dispatch) => {
  dispatch(storeSlice.actions.createStoreStart());
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/store/create-store`,
      formData,
      { withCredentials: true },
    );

    dispatch(storeSlice.actions.createStoreSuccess(res.data));
  } catch (error) {
    dispatch(
      storeSlice.actions.createStoreFailed(error.response?.data?.message),
    );
  }
};

// ✅ GET ALL STORES
export const fetchAllStores = () => async (dispatch) => {
  dispatch(storeSlice.actions.fetchStoreStart());
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/store/get-all-stores`,
      { withCredentials: true },
    );

    dispatch(storeSlice.actions.fetchStoreSuccess(res.data.data));
  } catch (error) {
    dispatch(
      storeSlice.actions.fetchStoreFailed(error.response?.data?.message),
    );
  }
};

// ✅ GET SINGLE STORE
export const fetchStoreById = (id) => async (dispatch) => {
  dispatch(storeSlice.actions.fetchSingleStoreStart());
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/store/${id}`,
      { withCredentials: true },
    );

    dispatch(storeSlice.actions.fetchSingleStoreSuccess(res.data.data));
  } catch (error) {
    dispatch(
      storeSlice.actions.fetchSingleStoreFailed(error.response?.data?.message),
    );
  }
};

// ✅ UPDATE STORE
export const updateStore =
  ({ id, formData }) =>
  async (dispatch) => {
    dispatch(storeSlice.actions.updateStoreStart());
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/store/${id}`,
        formData,
        { withCredentials: true },
      );

      dispatch(storeSlice.actions.updateStoreSuccess(res.data));
    } catch (error) {
      dispatch(
        storeSlice.actions.updateStoreFailed(error.response?.data?.message),
      );
    }
  };

// ✅ DELETE STORE
export const deleteStore = (id) => async (dispatch) => {
  dispatch(storeSlice.actions.deleteStoreStart());
  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/store/${id}`,
      { withCredentials: true },
    );

    dispatch(
      storeSlice.actions.deleteStoreSuccess({
        message: res.data.message,
        storeId: id,
      }),
    );
  } catch (error) {
    dispatch(
      storeSlice.actions.deleteStoreFailed(error.response?.data?.message),
    );
  }
};

export const getNearestStore =
  ({ lat, lng, orderType }) =>
  async (dispatch) => {
    dispatch(storeSlice.actions.nearestStoreStart());
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/store/nearest?lat=${lat}&lng=${lng}&orderType=${orderType}`,
        { withCredentials: true },
      );

      dispatch(storeSlice.actions.nearestStoreSuccess(res.data.data));
    } catch (error) {
      dispatch(
        storeSlice.actions.nearestStoreFailed(error.response?.data?.message),
      );
    }
  };

// ✅ TOGGLE STORE STATUS
export const toggleStore = (id) => async (dispatch) => {
  dispatch(storeSlice.actions.toggleStoreStart());
  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/store/toggle/${id}`,
      {},
      { withCredentials: true },
    );

    dispatch(storeSlice.actions.toggleStoreSuccess(res.data));
  } catch (error) {
    dispatch(
      storeSlice.actions.toggleStoreFailed(error.response?.data?.message),
    );
  }
};

export default storeSlice.reducer;
