import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Message } from "../../utils/types";

type MessageState = {
  error: boolean;
  success: boolean;
  loading: boolean;
  messagesList: Message[];
  message: string;
};

const initialState: MessageState = {
  error: false,
  success: false,
  loading: false,
  messagesList: [],
  message: "loading...",
};

const messageSlice = createSlice({
  name: "messageSlice",
  initialState,
  reducers: {
    fetchMessagesListError: (
      state,
      action: PayloadAction<{ message: string }>
    ) => {
      state.error = true;
      state.message = action.payload.message;
      state.loading = false;
    },
    fetchMessagesListSuccess: (
      state,
      action: PayloadAction<{ data: Message[]; message: string }>
    ) => {
      state.loading = false;
      state.success = true;
      state.messagesList = action.payload.data;
      state.message = action.payload.message;
    },
    fetchMessagesListLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addMessage: (state, action) => {
      state.messagesList = [...state.messagesList, action.payload];
    },
    deleteMessage: (
      state,
      action: PayloadAction<{
        messageId: string;
        deleteBySender: boolean;
      }>
    ) => {
      if (action.payload.deleteBySender) {
        state.messagesList = state.messagesList.filter(
          (message: Message) => message.messageId !== action.payload.messageId
        );
      } else {
        state.messagesList = state.messagesList.map((message: Message) => {
          if (message.messageId === action.payload.messageId) {
            message.deletedByReceiver = true;
            return message;
          } else return message;
        });
      }
    },
  },
});

type MessageSliceState = ReturnType<typeof messageSlice.reducer>;
type MessageSliceAction = typeof messageSlice.actions;

export const {
  fetchMessagesListError,
  fetchMessagesListSuccess,
  fetchMessagesListLoading,
  addMessage,
  deleteMessage,
} = messageSlice.actions;
export default messageSlice.reducer;
export type { MessageSliceState, MessageSliceAction };
