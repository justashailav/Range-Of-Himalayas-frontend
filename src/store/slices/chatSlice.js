import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    loading: false,
    error: null,
    messages: [
      {
        role: "assistant",
        text: "Hi 👋 Welcome to Range Of Himalayas 🌿 How can I help you?",
      },
    ],
  },
  reducers: {
    sendMessageStart(state) {
      state.loading = true;
      state.error = null;
    },
    sendMessageSuccess(state, action) {
      state.loading = false;
      state.messages.push({
        role: "assistant",
        text: action.payload,
      });
    },
    sendMessageFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.messages.push({
        role: "assistant",
        text: "Sorry 😕 Something went wrong. Please try again.",
      });
    },
    addUserMessage(state, action) {
      state.messages.push({
        role: "user",
        text: action.payload,
      });
    },
    resetChat(state) {
      state.loading = false;
      state.error = null;
      state.messages = [
        {
          role: "assistant",
          text: "Hi 👋 Welcome to Range Of Himalayas 🌿 How can I help you?",
        },
      ];
    },
  },
});

export const resetChat = () => (dispatch) => {
  dispatch(chatSlice.actions.resetChat());
};
export const sendChatMessage = (message) => async (dispatch) => {
  dispatch(chatSlice.actions.sendMessageStart());
  dispatch(chatSlice.actions.addUserMessage(message));

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/chat`,
      { message },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(chatSlice.actions.sendMessageSuccess(res.data.reply));
  } catch (error) {
    dispatch(
      chatSlice.actions.sendMessageFailed(
        error.response?.data?.message || "Chatbot error"
      )
    );
  }
};
export default chatSlice.reducer;
