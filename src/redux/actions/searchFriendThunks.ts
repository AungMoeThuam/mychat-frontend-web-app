import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  searchFriendError,
  searchFriendLoading,
  searchFriendSuccess,
} from "../slices/searchFriendSlice";
import { RootState } from "../store/store";
import { FriendShipApi } from "../../services/friendshipApi";
import { UNKNOWN_ERROR } from "../../utils/constants/messages/errorMessages";

const searchfriendNameThunk = createAsyncThunk(
  "searchFriend/searchname",
  async (name: string, { dispatch, getState }) => {
    try {
      dispatch(searchFriendLoading());
      let currentUserId = (getState() as RootState).authSlice.currentUserId;

      const result = await FriendShipApi.searchFriendsByName(
        name,
        currentUserId
      );
      if (result.error) return searchFriendError(result.error);

      dispatch(searchFriendSuccess(result.data));
    } catch (error: unknown) {
      if (error instanceof Error)
        return dispatch(searchFriendError(error.message));
      return dispatch(searchFriendError(UNKNOWN_ERROR));
    }
  }
);

export { searchfriendNameThunk };
