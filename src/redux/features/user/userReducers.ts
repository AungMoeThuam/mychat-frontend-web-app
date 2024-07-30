import { PayloadAction } from "@reduxjs/toolkit";
import { ProfilePhoto } from "../../../utils/constants/types";
import socket from "../../../service/socket";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { UserState } from "./userState";
const { getStorage, setStorage, removeStorage } = useLocalStorage("authToken");

const userReducers = {
  updateProfileImage: (
    state: UserState,
    action: PayloadAction<ProfilePhoto>
  ) => {
    state.profilePhoto = action.payload;
    setStorage({
      currentUserId: state.currentUserId,
      profilePhoto: action.payload,
      token: state.token,
    });
  },
  checkLoginStatus: (state: UserState) => {
    let auth = getStorage();
    if (auth) {
      let {
        token,
        currentUserId,
        profilePhoto,
        username,
      }: {
        token: string;
        currentUserId: string;
        profilePhoto: ProfilePhoto;
        username: string;
      } = auth;
      state.token = token;
      state.currentUserId = currentUserId;
      state.profilePhoto = profilePhoto;
      state.username = username;

      socket.connect(state.currentUserId);
    }
  },
  logout: (state: UserState) => {
    state.token = null;
    state.success = false;
    removeStorage();
  },
  loginError: (
    state: UserState,
    action: PayloadAction<{ message: string }>
  ) => {
    state.error = true;
    state.message = action.payload.message;
    state.loading = false;
    state.success = false;
  },
  loginSuccess: (
    state: UserState,
    action: PayloadAction<{
      credential: {
        username: string;
        token: string;
        currentUserId: string;
        profilePhoto: {
          createdAt?: Date;
          path?: string;
          mimetype?: string;
          size?: number;
        };
      };
      message: string;
    }>
  ) => {
    state.loading = false;
    state.error = false;
    state.success = true;
    state.token = action.payload.credential.token;
    state.currentUserId = action.payload.credential.currentUserId;
    state.message = action.payload.message;
    state.profilePhoto = action.payload.credential.profilePhoto;
    state.username = action.payload.credential.username;
    setStorage(action.payload.credential);
  },
  loginLoading: (state: UserState, action: PayloadAction<boolean>) => {
    state.error = false;
    state.success = false;
    state.loading = action.payload;
    state.message = "loading...";
  },
};

export default userReducers;
