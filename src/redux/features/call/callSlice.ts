import { createSlice } from "@reduxjs/toolkit";
import callState from "./callState";
import callReducers from "./callReducers";

const callSlice = createSlice({
  name: "callSlice",
  initialState: callState,
  reducers: callReducers,
});

type CallSliceState = ReturnType<typeof callSlice.reducer>;
type CallSliceAction = typeof callSlice.actions;

export const { create, startCall, endCall, minimizeCallWindow } =
  callSlice.actions;
export default callSlice.reducer;
export type { CallSliceState, CallSliceAction };
