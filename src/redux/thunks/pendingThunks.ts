import { createAsyncThunk } from "@reduxjs/toolkit";
import { Api } from "../../services/api";
import {
  fetchPendingsListError,
  fetchPendingsListLoading,
  fetchPendingsListSuccess,
} from "../slice/pendingSlice";

const getPendingsListThunk = createAsyncThunk(
  "pendings/getALl",
  async (currentUserId: string, { dispatch, getState }) => {
    try {
      dispatch(fetchPendingsListLoading(true));

      const result = await Api.getPendingsList(currentUserId);
      console.log(result);
      if (result.status === "success") {
        const { data, message } = result;
        dispatch(fetchPendingsListSuccess({ data, message }));
      } else if (result.status === "error") {
        dispatch(fetchPendingsListError({ message: result.message }));
      }
    } catch (error: unknown) {
      if (error instanceof Error)
        dispatch(fetchPendingsListError({ message: error.message }));
      dispatch(fetchPendingsListError({ message: "unknown error!" }));
    }
  }
);

export { getPendingsListThunk };
