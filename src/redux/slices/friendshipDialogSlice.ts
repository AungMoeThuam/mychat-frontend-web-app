import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const friendshipDialogSlice = createSlice({
  name: "friendshipDialogSlice",
  initialState: {
    error: false,
    loading: false,
    message: "",
    success: false,
  },
  reducers: {
    operationError: (state, action: PayloadAction<string>) => {
      state.error = true;
      state.message = action.payload;
    },
    operationSuccess: (state) => {
      state.success = true;
    },
    operationLoading: (state) => {
      state.loading = true;
    },
  },
});

type FriendshipDialogSliceState = ReturnType<
  typeof friendshipDialogSlice.reducer
>;
type FriendshipDialogSliceAction = typeof friendshipDialogSlice.actions;

export const { operationError, operationLoading, operationSuccess } =
  friendshipDialogSlice.actions;
export default friendshipDialogSlice.reducer;
export type { FriendshipDialogSliceState, FriendshipDialogSliceAction };
