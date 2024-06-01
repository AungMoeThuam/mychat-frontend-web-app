import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchFriendsError,
  fetchFriendsLoading,
  fetchFriendsSuccess,
} from "./friendSlice";
import { FriendShipApi } from "../../../service/friend-api-service";
import { UNKNOWN_ERROR } from "../../../utils/constants/messages/errorMessages";

const fetchFriends = createAsyncThunk(
  "friends/fetchFriends",
  async (_, { dispatch }) => {
    try {
      dispatch(fetchFriendsLoading(true));

      const result = await FriendShipApi.getFriendsList();

      if (result.error)
        return dispatch(fetchFriendsError({ message: result.error }));

      const { data } = result;
      return dispatch(fetchFriendsSuccess({ data, message: "Success!" }));
    } catch (error: unknown) {
      if (error instanceof Error)
        return dispatch(fetchFriendsError({ message: error.message }));
      return dispatch(fetchFriendsError({ message: UNKNOWN_ERROR }));
    }
  }
);

const fetchFriendsInBackground = createAsyncThunk(
  "friends/fetchFriendsInBackground",
  async (_, { dispatch }) => {
    try {
      const result = await FriendShipApi.getFriendsList();

      if (result.error)
        return dispatch(fetchFriendsError({ message: result.error }));

      const { data } = result;
      return dispatch(fetchFriendsSuccess({ data, message: "Success!" }));
    } catch (error: unknown) {
      if (error instanceof Error)
        return dispatch(fetchFriendsError({ message: error.message }));
      return dispatch(fetchFriendsError({ message: UNKNOWN_ERROR }));
    }
  }
);

export { fetchFriends, fetchFriendsInBackground };
