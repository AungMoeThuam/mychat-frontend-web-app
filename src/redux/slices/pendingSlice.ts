import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Friend } from "../../utils/types";
import pendingInitialState from "../stateTypes.ts/pendingState";

const pendingSlice = createSlice({
  name: "pendingSlice",
  initialState: pendingInitialState,
  reducers: {
    fetchPendingsListError: (
      state,
      action: PayloadAction<{ message: string }>
    ) => {
      state.error = true;
      state.message = action.payload.message;
      state.loading = false;
    },
    fetchPendingsListSuccess: (
      state,
      action: PayloadAction<{ data: Friend[]; message: string }>
    ) => {
      state.loading = false;
      state.success = true;
      state.pendingsList = action.payload.data;
      state.message = action.payload.message;
    },
    fetchPendingsListLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    cancelPendingAction: (state, action: PayloadAction<string>) => {
      state.pendingsList = state.pendingsList.filter(
        (pending) => pending.friendId !== action.payload
      );
    },
  },
});

type PendingSliceState = ReturnType<typeof pendingSlice.reducer>;
type PendingSliceAction = typeof pendingSlice.actions;

export const {
  fetchPendingsListError,
  fetchPendingsListLoading,
  fetchPendingsListSuccess,
  cancelPendingAction,
} = pendingSlice.actions;
export default pendingSlice.reducer;
export type { PendingSliceState, PendingSliceAction };
