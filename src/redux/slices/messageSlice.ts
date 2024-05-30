import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Message } from "../../utils/types";
import messageInitialState from "../stateTypes.ts/messageState";

const messageSlice = createSlice({
  name: "messageSlice",
  initialState: messageInitialState,
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
    updateMessage: (state, action) => {
      let tempMsg = state.messagesList.filter(
        (msg) => msg.messageId === action.payload.temporaryMessageId
      )[0];
      tempMsg = action.payload;

      state.messagesList = state.messagesList.filter(
        (msg) => msg.messageId !== action.payload.temporaryMessageId
      );
      state.messagesList.push(tempMsg);
    },
    updateMessageStatusIntoSeenAction: (state) => {
      let noNeedUpdate = state.messagesList.filter(
        (m) => m.status !== 0 && m.status !== 1
      );
      let needUpdate = state.messagesList.filter(
        (m) => m.status === 1 || m.status === 0
      );
      needUpdate = needUpdate.map((e) => {
        e.status = 2;
        return e;
      });

      state.messagesList = [...noNeedUpdate, ...needUpdate];
      console.log(state);
    },
    updateMessageStatusIntoDeliveredAction: (state) => {
      state.messagesList.forEach((message) => {
        if (message.status === 0) message.status = 1;
      });
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
  updateMessage,
  updateMessageStatusIntoSeenAction,
  updateMessageStatusIntoDeliveredAction,
} = messageSlice.actions;
export default messageSlice.reducer;
export type { MessageSliceState, MessageSliceAction };
