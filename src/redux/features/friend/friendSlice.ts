import { createSlice } from "@reduxjs/toolkit";
import friendInitialState from "./friendState";
import frinedReducers from "./friendReducers";

const friendSlice = createSlice({
  name: "friendSlice",
  initialState: friendInitialState,
  reducers: frinedReducers,
});

type FriendSliceState = ReturnType<typeof friendSlice.reducer>;
type FriendSliceAction = typeof friendSlice.actions;

export const {
  fetchFriendsError,
  fetchFriendsSuccess,
  fetchFriendsLoading,
  addNewMessage,
  updateOnlineStatus,
  unFriend,
  clearUnreadMessageCount,
  addNewUnreadMessageCount,
} = friendSlice.actions;
export default friendSlice.reducer;
export type { FriendSliceState, FriendSliceAction };
