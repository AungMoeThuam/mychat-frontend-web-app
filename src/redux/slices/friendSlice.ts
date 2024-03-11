import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Friend, Message } from "../../utils/types";

type FriendState = {
  error: boolean;
  success: boolean;
  loading: boolean;
  friendsList: Friend[];
  message: string;
};

const initialState: FriendState = {
  error: false,
  success: false,
  loading: false,
  friendsList: [],
  message: "loading...",
};

const friendSlice = createSlice({
  name: "friendSlice",
  initialState,
  reducers: {
    fetchFriendsListError: (
      state,
      action: PayloadAction<{ message: string }>
    ) => {
      state.error = true;
      state.message = action.payload.message;
      state.loading = false;
    },
    fetchFriendsListSuccess: (
      state,
      action: PayloadAction<{ data: Friend[]; message: string }>
    ) => {
      state.loading = false;
      state.success = true;
      state.friendsList = action.payload.data;
      state.message = action.payload.message;
    },
    fetchFriendsListLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    unFriendUpdate: (state, action: PayloadAction<{ friendId: string }>) => {
      state.friendsList = state.friendsList.filter(
        (item: Friend) => item.friendId !== action.payload.friendId
      );
    },
    addNewMessage: (state, action: PayloadAction<Message>) => {
      let temp: Friend;
      state.friendsList = state.friendsList
        .map((item: Friend) => {
          if (item.roomId === action.payload.roomId) {
            item.messageCreatedAt = action.payload.createdAt;
            item.content = action.payload.content;
            item.senderId = action.payload.senderId;
            item.type = action.payload.type;
            temp = item;
            return item;
          } else return item;
        })
        .filter((item) => item.roomId !== action.payload.roomId);
      state.friendsList.unshift(temp!); // temporarary code need to be fixed next
    },
    updateOnlineFriendStatus: (
      state,
      action: PayloadAction<{ userId: string; active: boolean }>
    ) => {
      state.friendsList = state.friendsList.map((item: Friend) => {
        if (item.friendId === action.payload.userId) {
          item.active = action.payload.active;
          return item;
        }
        return item;
      });
    },
  },
});

type FriendSliceState = ReturnType<typeof friendSlice.reducer>;
type FriendSliceAction = typeof friendSlice.actions;

export const {
  fetchFriendsListError,
  fetchFriendsListSuccess,
  fetchFriendsListLoading,
  addNewMessage,
  updateOnlineFriendStatus,
  unFriendUpdate,
} = friendSlice.actions;
export default friendSlice.reducer;
export type { FriendSliceState, FriendSliceAction };
