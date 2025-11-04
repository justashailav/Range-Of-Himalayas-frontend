import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const addressSlice = createSlice({
  name: "address",
  initialState: {
    loading: false,
    error: null,
    message: null,
    addressList: [],  
  },
  reducers: {
    addAddressStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addAddressSuccess: (state, action) => {
      state.loading = false;
      state.message = "Address added successfully";
      state.addressList.push(action.payload.data);
    },
    addAddressFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchAddressStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAddressSuccess: (state, action) => {
      state.loading = false;
      state.addressList = action.payload; 
    },
    fetchAddressFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    editAddressStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    editAddressSuccess: (state, action) => {
      state.loading = false;
      state.message = "Address updated successfully";
      const updatedAddress = action.payload.data;
      const index = state.addressList.findIndex(addr => addr._id === updatedAddress._id);
      if (index !== -1) {
        state.addressList[index] = updatedAddress;  
      }
    },
    editAddressFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteAddressStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteAddressSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.addressList = state.addressList.filter(
        (address) => address._id !== action.payload.addressId 
      );
    },
    deleteAddressFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const addAddress = (formData) => async (dispatch) => {
  dispatch(addressSlice.actions.addAddressStart());
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/add-address`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(addressSlice.actions.addAddressSuccess(res.data));
  } catch (error) {
    dispatch(addressSlice.actions.addAddressFailed(error.response?.data?.message));
  }
};

export const fetchAllAddress = (userId) => async (dispatch) => {
  dispatch(addressSlice.actions.fetchAddressStart());
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/get-address/${userId}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(addressSlice.actions.fetchAddressSuccess(res.data.addressList));
  } catch (error) {
    dispatch(addressSlice.actions.fetchAddressFailed(error.response?.data?.message));
  }
};

export const editAddress = ({userId, addressId, formData}) => async (dispatch) => {
  dispatch(addressSlice.actions.editAddressStart());
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/update-address/${userId}/${addressId}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch(addressSlice.actions.editAddressSuccess(res.data));
  } catch (error) {
    dispatch(addressSlice.actions.editAddressFailed(error.response?.data?.message));
  }
};

export const deleteAddress = ({userId, addressId}) => async (dispatch) => {
  dispatch(addressSlice.actions.deleteAddressStart());
  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/delete/${userId}/${addressId}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch(
      addressSlice.actions.deleteAddressSuccess({
        message: res.data.message,
        addressId: addressId,
      })
    );
  } catch (error) {
    dispatch(addressSlice.actions.deleteAddressFailed(error.response?.data?.message));
  }
};

export default addressSlice.reducer;
