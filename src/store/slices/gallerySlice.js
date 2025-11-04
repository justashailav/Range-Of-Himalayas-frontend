import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const gallerySlice = createSlice({
  name: "gallery",
  initialState: {
    loading: false,
    error: null,
    message: null,
    images: [],   // list of all gallery items
    selectedImage: null, // ✅ for getById
  },
  reducers: {
    galleryStart: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    gallerySuccess: (state, action) => {
      state.loading = false;
      state.images = action.payload;
    },
    galleryFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addImageSuccess: (state, action) => {
      state.loading = false;
      state.images.unshift(action.payload);
      state.message = "Gallery item created successfully!";
    },
    updateImageSuccess: (state, action) => {
      state.loading = false;
      state.images = state.images.map((img) =>
        img._id === action.payload._id ? action.payload : img
      );
      state.message = "Gallery item updated successfully!";
    },
    deleteImageSuccess: (state, action) => {
      state.loading = false;
      state.images = state.images.filter((img) => img._id !== action.payload);
      state.message = "Gallery item deleted successfully!";
    },
    getImageByIdSuccess: (state, action) => {
      state.loading = false;
      state.selectedImage = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const createGalleryItem = (formData) => async (dispatch) => {
  dispatch(gallerySlice.actions.galleryStart());
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/gallery/add`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    dispatch(gallerySlice.actions.addImageSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(
      gallerySlice.actions.galleryFailed(error.response?.data?.message || error.message)
    );
    return Promise.reject(error.response?.data?.message || error.message);
  }
};
export const getGalleryItems = () => async (dispatch) => {
  dispatch(gallerySlice.actions.galleryStart());
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/gallery/get`, {
      withCredentials: true,
    });
    dispatch(gallerySlice.actions.gallerySuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(
      gallerySlice.actions.galleryFailed(error.response?.data?.message || error.message)
    );
    return Promise.reject(error.response?.data?.message || error.message);
  }
};

// ✅ Get item by ID
export const getGalleryItemById = (id) => async (dispatch) => {
  dispatch(gallerySlice.actions.galleryStart());
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/gallery/${id}`, {
      withCredentials: true,
    });
    dispatch(gallerySlice.actions.getImageByIdSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(
      gallerySlice.actions.galleryFailed(error.response?.data?.message || error.message)
    );
    return Promise.reject(error.response?.data?.message || error.message);
  }
};

// ✅ Update item
export const updateGalleryItem = (id, formData) => async (dispatch) => {
  dispatch(gallerySlice.actions.galleryStart());
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/gallery/edit/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    dispatch(gallerySlice.actions.updateImageSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(
      gallerySlice.actions.galleryFailed(error.response?.data?.message || error.message)
    );
    return Promise.reject(error.response?.data?.message || error.message);
  }
};

// ✅ Delete item
export const deleteGalleryItem = (id) => async (dispatch) => {
  dispatch(gallerySlice.actions.galleryStart());
  try {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/gallery/delete/${id}`, {
      withCredentials: true,
    });
    dispatch(gallerySlice.actions.deleteImageSuccess(id));
    return id;
  } catch (error) {
    dispatch(
      gallerySlice.actions.galleryFailed(error.response?.data?.message || error.message)
    );
    return Promise.reject(error.response?.data?.message || error.message);
  }
};
export const { clearMessage, clearError } = gallerySlice.actions;
export default gallerySlice.reducer;
