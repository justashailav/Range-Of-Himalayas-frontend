import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    loading: false,
    error: null,
    message: null,
    blogs: [],
    currentBlog: null,
  },
  reducers: {
    createBlogStart: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    createBlogSuccess: (state, action) => {
      state.loading = false;
      state.message = "Blog created successfully";
      state.blogs.push(action.payload);
    },
    createBlogFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getAllBlogsStart: (state) => {
      state.loading = true;
    },
    getAllBlogsSuccess: (state, action) => {
      state.loading = false;
      state.blogs = action.payload;
    },
    getAllBlogsFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getBlogStart: (state) => {
      state.loading = true;
      state.error = null;
      state.currentBlog = null;
    },
    getBlogSuccess: (state, action) => {
      state.loading = false;
      state.currentBlog = action.payload;
    },
    getBlogFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    toggleLikeStart: (state) => {
      state.loading = true;
    },
    toggleLikeSuccess: (state, action) => {
      state.loading = false;
      const { blogId, likesCount, isLiked } = action.payload;
      const index = state.blogs.findIndex((b) => b._id === blogId);
      if (index !== -1) {
        state.blogs[index].likesCount = likesCount;
        state.blogs[index].isLiked = isLiked;
      }
      if (state.currentBlog && state.currentBlog._id === blogId) {
        state.currentBlog.likesCount = likesCount;
        state.currentBlog.isLiked = isLiked;
      }
    },
    toggleLikeFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addCommentStart: (state) => {
      state.loading = true;
    },
    addCommentSuccess: (state, action) => {
      state.loading = false;
      const { blogId, newComment } = action.payload;
      const blogIndex = state.blogs.findIndex((b) => b._id === blogId);
      if (blogIndex !== -1) {
        state.blogs[blogIndex].comments = [
          ...(state.blogs[blogIndex].comments || []),
          newComment,
        ];
      }
      if (state.currentBlog && state.currentBlog._id === blogId) {
        state.currentBlog.comments = [
          ...(state.currentBlog.comments || []),
          newComment,
        ];
      }
    },
    addCommentFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteBlogStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteBlogSuccess: (state, action) => {
      state.loading = false;
      state.message = "Blog deleted successfully";
      state.blogs = state.blogs.filter((b) => b._id !== action.payload);
    },
    deleteBlogFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
export const createBlog = (formData) => async (dispatch) => {
  dispatch(blogSlice.actions.createBlogStart());
  return axios
    .post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/blog/create`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    })
    .then((res) => {
      dispatch(blogSlice.actions.createBlogSuccess(res.data.data));
      return res.data;
    })
    .catch((error) => {
      const message = error.response?.data?.message || error.message;
      dispatch(blogSlice.actions.createBlogFailed(message));
      return Promise.reject(message);
    });
};
export const getAllBlogs = () => async (dispatch) => {
  dispatch(blogSlice.actions.getAllBlogsStart());
  return axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/blog/get-blogs`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
    .then((res) => {
      dispatch(blogSlice.actions.getAllBlogsSuccess(res.data.data));
      return res.data;
    })
    .catch((error) => {
      const message = error.response?.data?.message || error.message;
      dispatch(blogSlice.actions.getAllBlogsFailed(message));
      return Promise.reject(message);
    });
};
export const fetchBlogBySlug = (slug) => async (dispatch) => {
  dispatch(blogSlice.actions.getBlogStart());
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/blog/${slug}`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    dispatch(blogSlice.actions.getBlogSuccess(res.data.data));
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(blogSlice.actions.getBlogFailed(message));
    return Promise.reject(message);
  }
};
export const toggleLikeBlog = (blogId) => async (dispatch) => {
  dispatch(blogSlice.actions.toggleLikeStart());
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/blog/${blogId}/like`,
      {},
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    dispatch(
      blogSlice.actions.toggleLikeSuccess({
        blogId,
        likesCount: res.data.likesCount,
        isLiked: res.data.message === "Blog liked",
      })
    );

    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(blogSlice.actions.toggleLikeFailed(message));
    return Promise.reject(message);
  }
};

export const addCommentToBlog =
  (blogId, comment) => async (dispatch, getState) => {
    dispatch(blogSlice.actions.addCommentStart());
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/blog/${blogId}/comment`,
        { comment },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const user = getState().auth.user;
      const newComment = {
        username: user?.name || "Anonymous",
        comment,
        createdAt: new Date().toISOString(),
      };

      dispatch(blogSlice.actions.addCommentSuccess({ blogId, newComment }));
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch(blogSlice.actions.addCommentFailed(message));
      return Promise.reject(message);
    }
  };

export const updateBlog = (id, formData) => async (dispatch) => {
  dispatch(blogSlice.actions.createBlogStart());
  return axios
    .put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/blog/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    })
    .then((res) => {
      dispatch(blogSlice.actions.createBlogSuccess(res.data.data));
      return res.data;
    })
    .catch((error) => {
      const message = error.response?.data?.message || error.message;
      dispatch(blogSlice.actions.createBlogFailed(message));
      return Promise.reject(message);
    });
};
export const deleteBlog = (id) => async (dispatch) => {
  dispatch(blogSlice.actions.deleteBlogStart());
  return axios
    .delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/blog/delete/${id}`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(blogSlice.actions.deleteBlogSuccess(id));
      return res.data;
    })
    .catch((error) => {
      const message = error.response?.data?.message || error.message;
      dispatch(blogSlice.actions.deleteBlogFailed(message));
      return Promise.reject(message);
    });
};

export default blogSlice.reducer;
