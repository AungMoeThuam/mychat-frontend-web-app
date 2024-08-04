import { PayloadAction } from "@reduxjs/toolkit";
import { FriendState } from "./friendState";
import { Friend, Message } from "../../../lib/types/types";

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
        if (item.friendshipId === action.payload.friendshipId) {
          item.lastMessageCreatedAt = action.payload.createdAt;
          item.lastMessageContent = action.payload.content;
          item.lastMessageSenderId = action.payload.senderId;
          item.lastMessageType = action.payload.type;
          item.unreadMessageCount += 1;
          temp = item;
          return item;
        } else return item;
      })
      .filter((item) => item.friendshipId !== action.payload.friendshipId);
    state.friendsList.unshift(temp!); // temporarary code need to be fixed next
  },
  addNewMessage: (state: FriendState, action: PayloadAction<Message>) => {
    let temp: Friend;
    state.friendsList = state.friendsList
      .map((item: Friend) => {
        if (item.friendId === action.payload.friendshipId) {
          item.lastMessageCreatedAt = action.payload.createdAt;
          item.lastMessageContent = action.payload.content;
          item.lastMessageSenderId = action.payload.senderId;
          item.lastMessageType = action.payload.type;
          temp = item;
          return item;
        } else return item;
      })
      .filter((item) => item.friendshipId !== action.payload.friendshipId);
    state.friendsList.unshift(temp!); // temporarary code need to be fixed next
  },
  updateOnlineStatus: (
    state: FriendState,
    action: PayloadAction<{ userId: string; active: boolean }>
  ) => {
    state.friendsList = state.friendsList.map((item: Friend) => {
      if (item.friendId === action.payload.userId) {
        item.isActiveNow = action.payload.active;
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
      if (item.friendshipId === action.payload) {
        item.unreadMessageCount = 0;
        return item;
      }
      return item;
    });
  },
};

export default frinedReducers;
