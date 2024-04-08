import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchFriendsListError,
  fetchFriendsListLoading,
  fetchFriendsListSuccess,
} from "../slices/friendSlice";
import { RootState } from "../store/store";
import { FriendShipApi } from "../../services/friendshipApi";
import { UNKNOWN_ERROR } from "../../utils/constants/messages/errorMessages";

const getFriendsListAction = createAsyncThunk(
  "friends/getALl",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(fetchFriendsListLoading(true));
      const accessToken = (getState() as RootState).authSlice.token;

      const result = await FriendShipApi.getFriendsList(accessToken);

      if (result.error)
        return dispatch(
          fetchFriendsListError({ message: result.error.message })
        );

      const { data } = result;
      return dispatch(fetchFriendsListSuccess({ data, message: "Success!" }));
    } catch (error: unknown) {
      if (error instanceof Error)
        return dispatch(fetchFriendsListError({ message: error.message }));
      return dispatch(fetchFriendsListError({ message: UNKNOWN_ERROR }));
    }
  }
);

const getFriendsListInBackgroundAction = createAsyncThunk(
  "friends/getALlInBackground",
  async (_, { dispatch, getState }) => {
    try {
      const accessToken = (getState() as RootState).authSlice.token;

      const result = await FriendShipApi.getFriendsList(accessToken);

      if (result.error)
        return dispatch(
          fetchFriendsListError({ message: result.error.message })
        );

      const { data } = result;
      return dispatch(fetchFriendsListSuccess({ data, message: "Success!" }));
    } catch (error: unknown) {
      if (error instanceof Error)
        return dispatch(fetchFriendsListError({ message: error.message }));
      return dispatch(fetchFriendsListError({ message: UNKNOWN_ERROR }));
    }
  }
);

export { getFriendsListAction, getFriendsListInBackgroundAction };
