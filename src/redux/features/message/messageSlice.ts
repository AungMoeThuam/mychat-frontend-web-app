import { createSlice } from "@reduxjs/toolkit";
import messageInitialState from "./messageState";
import messageReducers from "./messageReducers";

const messageSlice = createSlice({
  name: "messageSlice",
  initialState: messageInitialState,
  reducers: messageReducers,
});

type MessageSliceState = ReturnType<typeof messageSlice.reducer>;
type MessageSliceAction = typeof messageSlice.actions;

export const {
  fetchMessagesError,
  fetchMessagesSuccess,
  fetchMessagesLoading,
  addMessage,
  deleteMessageSuccess,
  updateMessageSuccess,
  updateMessageStatusIntoSeenAction,
  updateMessageStatusIntoDeliveredAction,
} = messageSlice.actions;
export default messageSlice.reducer;
export type { MessageSliceState, MessageSliceAction };
