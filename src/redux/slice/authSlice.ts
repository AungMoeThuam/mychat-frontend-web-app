import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import socket from "../../services/socket";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { ProfilePhoto } from "../../utils/types";

const { getStorage, setStorage, removeStorage } = useLocalStorage("authToken");
type AuthState = {
  error: boolean;
  success: boolean;
  loading: boolean;
  token: string | null;
  message: string;
  currentUserId: string;
  profilePhoto: ProfilePhoto;
};

// {
//   createdAt?: Date;
//   path?: string;
//   mimetype?: string;
//   size?: number;
// };

const initialState: AuthState = {
  error: false,
  success: false,
  loading: false,
  token: null,
  currentUserId: "",
  profilePhoto: {},
  message: "loading...",
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    updateProfileImage: (state, action: PayloadAction<ProfilePhoto>) => {
      state.profilePhoto = action.payload;
      setStorage({
        currentUserId: state.currentUserId,
        profilePhoto: action.payload,
        token: state.token,
      });
    },
    checkAuth: (state) => {
      let auth = getStorage();
      if (auth) {
        let {
          token,
          currentUserId,
          profilePhoto,
        }: {
          token: string;
          currentUserId: string;
          profilePhoto: ProfilePhoto;
        } = auth;
        state.token = token;
        state.currentUserId = currentUserId;
        state.profilePhoto = profilePhoto;

        socket.connect(state.currentUserId);
      }
    },
    logout: (state) => {
      state.token = null;
      // removeAuth();
      removeStorage();
    },
    authError: (state, action: PayloadAction<{ message: string }>) => {
      state.error = true;
      state.message = action.payload.message;
      state.loading = false;
      state.success = false;
    },
    authSuccess: (
      state,
      action: PayloadAction<{
        credential: {
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
      // setToken(action.payload.credential);
      setStorage(action.payload.credential);
    },
    authLoading: (state, action: PayloadAction<boolean>) => {
      state.error = false;
      state.success = false;
      state.loading = action.payload;
      state.message = "loading...";
    },
  },
});

type AuthSliceState = ReturnType<typeof authSlice.reducer>;
type AuthSliceActions = typeof authSlice.actions;

export const {
  updateProfileImage,
  authLoading,
  authError,
  authSuccess,
  logout,
  checkAuth,
} = authSlice.actions;
export default authSlice.reducer;
export type { AuthSliceActions, AuthSliceState };
