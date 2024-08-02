import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPendingsListError,
  fetchPendingsListLoading,
  fetchPendingsListSuccess,
} from "./pendingSlice";
import { UNKNOWN_ERROR } from "../../../lib/constants/errorMessages";
import friendService from "../../../service/friend.service";

const getPendingsListThunk = createAsyncThunk(
  "pendings/getALl",
  async (currentUserId: string, { dispatch }) => {
    //add getstate if need to access the global state from redux
    try {
      dispatch(fetchPendingsListLoading(true));

      const result = await friendService.getPendingsList(currentUserId);

      if (result.error)
        return dispatch(fetchPendingsListError({ message: result.error }));

      return dispatch(
        fetchPendingsListSuccess({
          data: result.data,
          message: "success pending list1",
        })
      );
    } catch (error: unknown) {
      if (error instanceof Error)
        return dispatch(fetchPendingsListError({ message: error.message }));
      return dispatch(fetchPendingsListError({ message: UNKNOWN_ERROR }));
    }
  }
);

export { getPendingsListThunk };
