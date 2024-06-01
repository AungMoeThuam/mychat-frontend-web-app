import { PayloadAction } from "@reduxjs/toolkit";
import { Friend, Message } from "../../../utils/constants/types";
import { FriendState } from "./friendState";

const frinedReducers = {
  fetchFriendsError: (
    state: FriendState,
    action: PayloadAction<{ message: string }>
  ) => {
    state.error = true;
    state.message = action.payload.message;
    state.loading = false;
  },
  fetchFriendsSuccess: (
    state: FriendState,
    action: PayloadAction<{ data: Friend[]; message: string }>
  ) => {
    state.loading = false;
    state.success = true;
    state.friendsList = action.payload.data;
    state.message = action.payload.message;
  },
  fetchFriendsLoading: (state: FriendState, action: PayloadAction<boolean>) => {
    state.loading = action.payload;
  },
  unFriend: (
    state: FriendState,
    action: PayloadAction<{ friendId: string }>
  ) => {
    state.friendsList = state.friendsList.filter(
      (item: Friend) => item.friendId !== action.payload.friendId
    );
  },
  addNewUnreadMessageCount: (
    state: FriendState,
    action: PayloadAction<Message>
  ) => {
    let temp: Friend;
    state.friendsList = state.friendsList
      .map((item: Friend) => {
        if (item.roomId === action.payload.roomId) {
          item.messageCreatedAt = action.payload.createdAt;
          item.content = action.payload.content;
          item.senderId = action.payload.senderId;
          item.type = action.payload.type;
          item.unreadMessageCount += 1;
          temp = item;
          return item;
        } else return item;
      })
      .filter((item) => item.roomId !== action.payload.roomId);
    state.friendsList.unshift(temp!); // temporarary code need to be fixed next
  },
  addNewMessage: (state: FriendState, action: PayloadAction<Message>) => {
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
  updateOnlineStatus: (
    state: FriendState,
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
  clearUnreadMessageCount: (
    state: FriendState,
    action: PayloadAction<string>
  ) => {
    state.friendsList = state.friendsList.map((item) => {
      if (item.roomId === action.payload) {
        item.unreadMessageCount = 0;
        return item;
      }
      return item;
    });
  },
};

export default frinedReducers;
