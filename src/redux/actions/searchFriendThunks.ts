import { createAsyncThunk } from "@reduxjs/toolkit";
import { searchFriendByName } from "../slices/searchFriendSlice";
import { RootState } from "../store/store";
import { FriendShipApi } from "../../services/friendshipApi";

const searchfriendNameThunk = createAsyncThunk(
  "searchFriend/searchname",
  async (name: string, { dispatch, getState }) => {
    try {
      let currentUserId = (getState() as RootState).authSlice.currentUserId;

      const result = await FriendShipApi.searchFriendsByName(
        name,
        currentUserId
      );
      if (result.error) return console.log(result.error.message);

      dispatch(searchFriendByName(result.data));
    } catch (error: any) {}
  }
);

export { searchfriendNameThunk };
