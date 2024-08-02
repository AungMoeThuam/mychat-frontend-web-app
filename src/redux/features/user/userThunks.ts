import authService from "../../../service/auth.service";
import {
  PASSWORD_NOT_MATCHED_WARNING,
  UNKNOWN_ERROR,
} from "../../../lib/constants/errorMessages";
import { LOGINSUCESS } from "../../../lib/constants/sucessMessages";
import { loginError, loginLoading, loginSuccess } from "./userSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RegisterForm } from "../../../lib/types/types";

const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (form: { email: string; password: string }, { dispatch }) => {
    try {
      dispatch(loginLoading(true));
      const result = await authService.login(form);
      if (result.error) return dispatch(loginError({ message: result.error }));

      return dispatch(
        loginSuccess({
          credential: {
            username: result.data.username,
            token: result.data.token,
            currentUserId: result.data.currentUserId,
            profilePhoto: result.data.profilePhoto,
          },
          message: LOGINSUCESS,
        })
      );
    } catch (error: unknown) {
      if (error instanceof Error)
        return dispatch(loginError({ message: error.message }));
      dispatch(loginError({ message: UNKNOWN_ERROR }));
    }
  }
);

const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (form: RegisterForm, { dispatch }) => {
    try {
      dispatch(loginLoading(true));
      if (form.password.trim() !== form.confirmPassword.trim())
        return dispatch(
          loginError({
            message: PASSWORD_NOT_MATCHED_WARNING,
          })
        );

      const result = await authService.register(form);
      if (result.error) return dispatch(loginError({ message: result.error }));

      return dispatch(
        loginSuccess({
          credential: {
            username: result.data.username,
            token: result.data.token,
            currentUserId: result.data.currentUserId,
            profilePhoto: result.data.profilePhoto,
          },
          message: LOGINSUCESS,
        })
      );
    } catch (error: unknown) {
      if (error instanceof Error)
        return dispatch(loginError({ message: error.message }));
      dispatch(loginError({ message: UNKNOWN_ERROR }));
    }
  }
);

export { registerUser, loginUser };
