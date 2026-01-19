import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialMessage = {
  role: "assistant",
  text: "Hi 👋 Welcome to Range Of Himalayas 🌿 How can I help you?",
};

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    loading: false,
    error: null,
    messages: [initialMessage],
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
        text:
          "I’m facing a small issue 🌿 Please contact us on WhatsApp for quick support.",
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
      state.messages = [initialMessage];
    },
  },
});

export const resetChat = () => (dispatch) => {
  dispatch(chatSlice.actions.resetChat());
};

export const sendChatMessage = (message) => async (dispatch) => {
  if (!message || !message.trim()) return; // ✅ BLOCK EMPTY

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
