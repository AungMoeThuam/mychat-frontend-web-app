import { backendUrl } from "../../utils/backendConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchFriendsListError,
  fetchFriendsListLoading,
  fetchFriendsListSuccess,
} from "../slice/friendSlice";
import { RootState } from "../store/store";

const getFriendsListThunk = createAsyncThunk(
  "friends/getALl",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(fetchFriendsListLoading(true));
      const res = await fetch(`${backendUrl}/friends`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + (getState() as RootState).authSlice.token,
        },
      });
      const result = await res.json();
      if (result.status === "success") {
        const { data, message } = result;
        dispatch(fetchFriendsListSuccess({ data, message }));
      } else if (result.status === "error") {
        dispatch(fetchFriendsListError({ message: result.message }));
      }
    } catch (error: any) {
      dispatch(fetchFriendsListError({ message: error.message }));
    }
  }
);

export { getFriendsListThunk };
