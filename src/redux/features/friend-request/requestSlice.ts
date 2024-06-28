import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import requestInitialState from "./requestState";
import { Person } from "../../../lib/models/models";

const requestSlice = createSlice({
  name: "requestSlice",
  initialState: requestInitialState,
  reducers: {
    fetchRequestsListError: (
      state,
      action: PayloadAction<{ message: string }>
    ) => {
      state.error = true;
      state.message = action.payload.message;
      state.loading = false;
    },
    fetchRequestsListSuccess: (
      state,
      action: PayloadAction<{ data: Person[]; message: string }>
    ) => {
      state.loading = false;
      state.success = true;
      state.requestsList = action.payload.data;
      state.message = action.payload.message;
    },
    fetchRequestsListLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    acceptRequestAction: (state, action: PayloadAction<string>) => {
      state.requestsList = state.requestsList.filter(
        (request) => request.personId !== action.payload
      );
    },
    rejectRequestAction: (state, action: PayloadAction<string>) => {
      state.requestsList = state.requestsList.filter(
        (request) => request.personId !== action.payload
      );
    },
  },
});

type RequestSliceState = ReturnType<typeof requestSlice.reducer>;
type RequestSliceAction = typeof requestSlice.actions;

export const {
  fetchRequestsListError,
  fetchRequestsListSuccess,
  fetchRequestsListLoading,
  acceptRequestAction,
  rejectRequestAction,
} = requestSlice.actions;
export default requestSlice.reducer;
export type { RequestSliceState, RequestSliceAction };
