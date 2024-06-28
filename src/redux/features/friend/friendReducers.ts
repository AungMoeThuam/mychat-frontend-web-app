import { PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../../../utils/constants/types";
import { FriendState } from "./friendState";
import { Friend } from "../../../lib/models/models";

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
        if (item.friendshipId === action.payload.roomId) {
          item.lastMessageCreatedAt = action.payload.createdAt;
          item.lastMessageContent = action.payload.content;
          item.lastMessageSenderId = action.payload.senderId;
          item.lastMessageType = action.payload.type;
          item.unreadMessagesCount += 1;
          temp = item;
          return item;
        } else return item;
      })
      .filter((item) => item.friendshipId !== action.payload.roomId);
    state.friendsList.unshift(temp!); // temporarary code need to be fixed next
  },
  addNewMessage: (state: FriendState, action: PayloadAction<Message>) => {
    let temp: Friend;
    state.friendsList = state.friendsList
      .map((item: Friend) => {
        if (item.friendId === action.payload.roomId) {
          item.lastMessageCreatedAt = action.payload.createdAt;
          item.lastMessageContent = action.payload.content;
          item.lastMessageSenderId = action.payload.senderId;
          item.lastMessageType = action.payload.type;
          temp = item;
          return item;
        } else return item;
      })
      .filter((item) => item.friendshipId !== action.payload.roomId);
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
        item.unreadMessagesCount = 0;
        return item;
      }
      return item;
    });
  },
};

export default frinedReducers;
