import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchCartItems } from "./cartSlice";

const customBoxSlice = createSlice({
  name: "customBox",
  initialState: {
    loading: false,
    error: null,
    message: null,
    boxes: [],
    currentBox: null,
  },
  reducers: {
    createBoxStart: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    createBoxSuccess: (state, action) => {
      state.loading = false;
      state.message = "Custom box created successfully";
      state.boxes.push(action.payload);
    },
    createBoxFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchBoxesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBoxesSuccess: (state, action) => {
      state.loading = false;
      state.boxes = action.payload
    },
    fetchBoxesFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchBoxByIdStart: (state) => {
      state.loading = true;
      state.error = null;
      state.currentBox = null;
    },
    fetchBoxByIdSuccess: (state, action) => {
      state.loading = false;
      state.currentBox = action.payload;
    },
    fetchBoxByIdFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
   
     updateBoxStart: (state) => {
  state.loading = true;
  state.error = null;
  state.message = null;
},

updateBoxSuccess: (state, action) => {
  state.loading = false;

  // Extract payload
  const { message, updatedBox, cartUpdate } = action.payload;

  // Store backend message
  state.message = message || "Custom box updated successfully";

  // Update in list
  if (updatedBox?._id) {
    const index = state.boxes.findIndex((box) => box._id === updatedBox._id);
    if (index !== -1) {
      state.boxes[index] = { ...state.boxes[index], ...updatedBox };
    } else {
      state.boxes.push(updatedBox); // in case box wasn’t already in list
    }

    // Sync currentBox
    if (state.currentBox?._id === updatedBox._id) {
      state.currentBox = { ...state.currentBox, ...updatedBox };
    }
  }

  // Optionally store cartUpdate
  state.cartUpdate = cartUpdate || null;
},

updateBoxFailed: (state, action) => {
  state.loading = false;
  state.error = action.payload || "Failed to update custom box";
},


    deleteCustomBoxStart(state) {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    deleteCustomBoxSuccess(state, action) {
      state.loading = false;
      state.success = true;
      state.boxes = state.boxes.filter(
        (customBox) => customBox._id !== action.payload
      );
    },
    deleteCustomBoxFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
  },
});

export const createCustomBox = (boxData) => async (dispatch) => {
  dispatch(customBoxSlice.actions.createBoxStart());
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/custom-box/create-box`,
      boxData,
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );
    dispatch(customBoxSlice.actions.createBoxSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(
      customBoxSlice.actions.createBoxFailed(
        error.response?.data?.error || error.message
      )
    );
    return Promise.reject(error.response?.data?.error || error.message);
  }
};

export const fetchUserCustomBoxes = (userId) => async (dispatch) => {
  dispatch(customBoxSlice.actions.fetchBoxesStart());
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/custom-box/get-boxes/${userId}`, {
      withCredentials: true,
    });
    console.log("Fetched boxes response:", res.data);
    dispatch(customBoxSlice.actions.fetchBoxesSuccess(res.data));
  } catch (error) {
    dispatch(
      customBoxSlice.actions.fetchBoxesFailed(
        error.response?.data?.error || error.message
      )
    );
  }
};

export const fetchCustomBoxById = (id) => async (dispatch) => {
  dispatch(customBoxSlice.actions.fetchBoxByIdStart());
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/custom-box/get-box/${id}`, {
      withCredentials: true,
    });
    console.log("Fetched boxes response By Id",res.data)
    dispatch(customBoxSlice.actions.fetchBoxByIdSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(
      customBoxSlice.actions.fetchBoxByIdFailed(
        error.response?.data?.error || error.message
      )
    );
  }
};

export const updateCustomBox = ({id, boxData}) => async (dispatch) => {
  dispatch(customBoxSlice.actions.updateBoxStart());
  try {
     console.log("Fetching box with id:", id);
    const res = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/custom-box/update-box/${id}`,
      boxData,
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );
    console.log("Fetch update box response",res.data)
    dispatch(customBoxSlice.actions.updateBoxSuccess(res.data));
    
  } catch (error) {
    dispatch(
      customBoxSlice.actions.updateBoxFailed(
        error.response?.data?.error || error.message
      )
    );
    return Promise.reject(error.response?.data?.error || error.message);
  }
};

export const deleteCustomBox = (id) => async (dispatch) => {
  dispatch(customBoxSlice.actions.deleteCustomBoxStart());

  return axios
    .delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/custom-box/delete-box/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then(() => {
      dispatch(customBoxSlice.actions.deleteCustomBoxSuccess(id));
    })
    .catch((error) => {
      const message = error.response?.data?.message || error.message;
      dispatch(customBoxSlice.actions.deleteCustomBoxFailed(message));
      return Promise.reject(message);
    });
};

export default customBoxSlice.reducer;
