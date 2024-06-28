import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchRequestsListError,
  fetchRequestsListLoading,
  fetchRequestsListSuccess,
} from "./requestSlice";
import { FriendShipApi } from "../../../service/friend-api-service";

const getRequestsListThunk = createAsyncThunk(
  "requests/getALl",
  async (currentUserId: string, { dispatch }) => {
    try {
      dispatch(fetchRequestsListLoading(true));

      const result = await FriendShipApi.getRequestsList(currentUserId);

      if (result.error)
        return dispatch(fetchRequestsListError({ message: result.error }));

      console.log(result.data);
      return dispatch(
        fetchRequestsListSuccess({
          data: result.data,
          message: "success request!",
        })
      );
    } catch (error: unknown) {
      if (error instanceof Error)
        return dispatch(fetchRequestsListError({ message: error.message }));
      return dispatch(fetchRequestsListError({ message: "unknown error!" }));
    }
  }
);

export { getRequestsListThunk };
