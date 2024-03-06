import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchRequestsListError,
  fetchRequestsListLoading,
  fetchRequestsListSuccess,
} from "../slice/requestSlice";
import { Api } from "../../services/api";

const getRequestsListThunk = createAsyncThunk(
  "requests/getALl",
  async (currentUserId: string, { dispatch, getState }) => {
    try {
      dispatch(fetchRequestsListLoading(true));

      const result = await Api.getRequestsList(currentUserId);

      if (result.status === "success") {
        const { data, message } = result;
        dispatch(fetchRequestsListSuccess({ data, message }));
      } else if (result.status === "error") {
        dispatch(fetchRequestsListError({ message: result.message }));
      }
    } catch (error: unknown) {
      if (error instanceof Error)
        dispatch(fetchRequestsListError({ message: error.message }));
      dispatch(fetchRequestsListError({ message: "unknown error!" }));
    }
  }
);

export { getRequestsListThunk };
