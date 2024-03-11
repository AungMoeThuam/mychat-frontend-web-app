import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Friend } from "../../utils/types";

type RequestState = {
  error: boolean;
  success: boolean;
  loading: boolean;
  requestsList: Friend[];
  message: string;
};

const initialState: RequestState = {
  error: false,
  success: false,
  loading: false,
  requestsList: [],
  message: "loading...",
};

const requestSlice = createSlice({
  name: "requestSlice",
  initialState,
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
      action: PayloadAction<{ data: Friend[]; message: string }>
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
        (request) => request.friendId !== action.payload
      );
    },
    rejectRequestAction: (state, action: PayloadAction<string>) => {
      state.requestsList = state.requestsList.filter(
        (request) => request.friendId !== action.payload
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
