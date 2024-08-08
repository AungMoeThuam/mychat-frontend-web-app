import { createSlice } from "@reduxjs/toolkit";
import authInitialState from "./userState";
import userReducers from "./userReducers";

const userSlice = createSlice({
  name: "userSlice",
  initialState: authInitialState,
  reducers: userReducers,
});

type UserSliceState = ReturnType<typeof userSlice.reducer>;
type UserSliceActions = typeof userSlice.actions;

export const {
  updateProfileImage,
  logout,
  checkLoginStatus,
  loginError,
  loginLoading,
  loginSuccess,
  resetAuth,
} = userSlice.actions;
export default userSlice.reducer;
export type { UserSliceActions, UserSliceState };
