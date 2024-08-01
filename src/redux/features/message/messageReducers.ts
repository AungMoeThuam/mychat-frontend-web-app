import { PayloadAction } from "@reduxjs/toolkit";
import { MessageState } from "./messageState";
import { Message } from "../../../lib/models/models";

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
    action: PayloadAction<{
      data: Message[];
      message: string;
      pagination?: boolean;
    }>
  ) => {
    state.loading = false;
    state.success = true;
    if (action.payload.pagination === true) {
      state.messagesList = [...action.payload.data, ...state.messagesList];
      state.message = action.payload.message;
      return;
    }
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
    let noNeedUpdate = state.messagesList.filter((m) => m.deliveryStatus == 2);
    let needUpdate = state.messagesList.filter(
      (m) => m.deliveryStatus === 1 || m.deliveryStatus === 0
    );
    needUpdate = needUpdate.map((e) => {
      e.deliveryStatus = 2;
      return e;
    });

    state.messagesList = [...noNeedUpdate, ...needUpdate];
  },
  updateMessageStatusIntoDeliveredAction: (state: MessageState) => {
    state.messagesList.forEach((message) => {
      if (message.deliveryStatus === 0) message.deliveryStatus = 1;
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
          message.isDeletedByReceiver = true;
          return message;
        } else return message;
      });
    }
  },
};

export default messageReducers;
