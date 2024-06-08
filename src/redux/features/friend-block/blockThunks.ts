import { createAsyncThunk } from "@reduxjs/toolkit";
import { FriendShipApi } from "../../../service/friend-api-service";
import {
  fetchBlocksListError,
  fetchBlocksListLoading,
  fetchBlocksListSuccess,
} from "./blockSlice";
import { UNKNOWN_ERROR } from "../../../utils/constants/messages/errorMessages";

const getBlocksListThunk = createAsyncThunk(
  "blocks/getALl",
  async (currentUserId: string, { dispatch }) => {
    //add getstate if need to access the global state from redux
    try {
      dispatch(fetchBlocksListLoading(true));

      const result = await FriendShipApi.getBlocksList(currentUserId);

      if (result.error)
        return dispatch(fetchBlocksListError({ message: result.error }));

      return dispatch(
        fetchBlocksListSuccess({
          data: result.data,
          message: "success blocklists",
        })
      );
    } catch (error: unknown) {
      if (error instanceof Error)
        return dispatch(fetchBlocksListError({ message: error.message }));
      return dispatch(fetchBlocksListError({ message: UNKNOWN_ERROR }));
    }
  }
);

export { getBlocksListThunk };
