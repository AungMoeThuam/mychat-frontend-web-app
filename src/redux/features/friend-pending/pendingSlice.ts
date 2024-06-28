import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import pendingInitialState from "./pendingState";
import { Person } from "../../../lib/models/models";

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
      action: PayloadAction<{ data: Person[]; message: string }>
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
        (pending) => pending.personId !== action.payload
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
