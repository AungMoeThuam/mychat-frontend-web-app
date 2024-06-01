import { PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../../../utils/constants/types";
import { MessageState } from "./messageState";

const messageReducers = {
  fetchMessagesError: (
    state: MessageState,
    action: PayloadAction<{ message: string }>
  ) => {
    state.error = true;
    state.message = action.payload.message;
    state.loading = false;
  },
  fetchMessagesSuccess: (
    state: MessageState,
    action: PayloadAction<{ data: Message[]; message: string }>
  ) => {
    state.loading = false;
    state.success = true;
    state.messagesList = action.payload.data;
    state.message = action.payload.message;
  },
  fetchMessagesLoading: (
    state: MessageState,
    action: PayloadAction<boolean>
  ) => {
    state.loading = action.payload;
  },
  addMessage: (state: MessageState, action: PayloadAction<Message>) => {
    state.messagesList = [...state.messagesList, action.payload];
  },
  updateMessageSuccess: (
    state: MessageState,
    action: PayloadAction<Message & { temporaryMessageId: string }>
  ) => {
    let tempMsg = state.messagesList.filter(
      (msg) => msg.messageId === action.payload.temporaryMessageId
    )[0];
    tempMsg = action.payload;

    state.messagesList = state.messagesList.filter(
      (msg) => msg.messageId !== action.payload.temporaryMessageId
    );
    state.messagesList.push(tempMsg);
  },
  updateMessageStatusIntoSeenAction: (state: MessageState) => {
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
  updateMessageStatusIntoDeliveredAction: (state: MessageState) => {
    state.messagesList.forEach((message) => {
      if (message.status === 0) message.status = 1;
    });
  },
  deleteMessageSuccess: (
    state: MessageState,
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
};

export default messageReducers;