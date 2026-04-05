import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const batchSlice = createSlice({
  name: "batch",
  initialState: {
    loading: false,
    error: null,
    message: null,
    batchList: [],
    batch: null,
    trace: null,
  },

  reducers: {
    // 🔥 CREATE
    createBatchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createBatchSuccess: (state, action) => {
      state.loading = false;
      state.message = "Batch created successfully";
      state.batchList.push(action.payload.batch);
    },
    createBatchFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔥 GET ALL
    fetchBatchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBatchSuccess: (state, action) => {
      state.loading = false;
      state.batchList = action.payload;
    },
    fetchBatchFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔥 GET ONE
    getBatchSuccess: (state, action) => {
      state.batch = action.payload;
    },

    // 🌿 TRACE
    traceBatchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    traceBatchSuccess: (state, action) => {
      state.loading = false;
      state.trace = action.payload;
    },
    traceBatchFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔥 UPDATE
    updateBatchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateBatchSuccess: (state, action) => {
      state.loading = false;
      state.message = "Batch updated successfully";

      const updated = action.payload.batch;

      const index = state.batchList.findIndex(
        (b) => b.batchId === updated.batchId
      );

      if (index !== -1) {
        state.batchList[index] = updated;
      }
    },
    updateBatchFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔥 DELETE
    deleteBatchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteBatchSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;

      state.batchList = state.batchList.filter(
        (b) => b.batchId !== action.payload.batchId
      );
    },
    deleteBatchFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});


// ================= API CALLS =================

// ✅ CREATE
export const createBatch = (data) => async (dispatch) => {
  dispatch(batchSlice.actions.createBatchStart());
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/batch/create-batch`,
      data
    );
    dispatch(batchSlice.actions.createBatchSuccess(res.data));
  } catch (error) {
    dispatch(
      batchSlice.actions.createBatchFailed(
        error.response?.data?.message
      )
    );
  }
};


// ✅ GET ALL
export const getAllBatches = () => async (dispatch) => {
  dispatch(batchSlice.actions.fetchBatchStart());
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/batch/get-all-batches`
    );
    dispatch(
      batchSlice.actions.fetchBatchSuccess(res.data.batches)
    );
  } catch (error) {
    dispatch(
      batchSlice.actions.fetchBatchFailed(
        error.response?.data?.message
      )
    );
  }
};


// ✅ GET ONE
export const getBatchById = (batchId) => async (dispatch) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/batch/${batchId}`
    );
    dispatch(
      batchSlice.actions.getBatchSuccess(res.data.batch)
    );
  } catch (error) {
    console.log(error);
  }
};


// 🌿 TRACE
export const traceBatch = (batchId) => async (dispatch) => {
  dispatch(batchSlice.actions.traceBatchStart());
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/batch/trace/${batchId}`
    );
    dispatch(
      batchSlice.actions.traceBatchSuccess(res.data.data)
    );
  } catch (error) {
    dispatch(
      batchSlice.actions.traceBatchFailed(
        error.response?.data?.message
      )
    );
  }
};


// ✅ UPDATE
export const updateBatch = (batchId, data) => async (dispatch) => {
  dispatch(batchSlice.actions.updateBatchStart());
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/batch/${batchId}`,
      data
    );
    dispatch(batchSlice.actions.updateBatchSuccess(res.data));
  } catch (error) {
    dispatch(
      batchSlice.actions.updateBatchFailed(
        error.response?.data?.message
      )
    );
  }
};


// ✅ DELETE
export const deleteBatch = (batchId) => async (dispatch) => {
  dispatch(batchSlice.actions.deleteBatchStart());
  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/batch/${batchId}`
    );

    dispatch(
      batchSlice.actions.deleteBatchSuccess({
        message: res.data.message,
        batchId,
      })
    );
  } catch (error) {
    dispatch(
      batchSlice.actions.deleteBatchFailed(
        error.response?.data?.message
      )
    );
  }
};


export default batchSlice.reducer;