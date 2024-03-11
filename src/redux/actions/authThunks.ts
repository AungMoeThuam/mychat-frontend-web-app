import { AuthApi } from "../../services/authApi";
import {
  PASSWORD_NOT_MATCHED_WARNING,
  UNKNOWN_ERROR,
} from "../../utils/constants/messages/errorMessages";
import { LOGINSUCESS } from "../../utils/constants/messages/sucessMessages";
import { RegisterForm } from "../../utils/types";
import { authError, authLoading, authSuccess } from "../slices/authSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";

const loginAction = createAsyncThunk(
  "auth/loginAction",
  async (form: { email: string; password: string }, { dispatch }) => {
    try {
      dispatch(authLoading(true));
      const result = await AuthApi.login(form);
      if (result.error)
        return dispatch(authError({ message: result.error.message }));

      return dispatch(
        authSuccess({
          credential: {
            token: result.data.token,
            currentUserId: result.data.currentUserId,
            profilePhoto: result.data.profilePhoto,
          },
          message: LOGINSUCESS,
        })
      );
    } catch (error: unknown) {
      if (error instanceof Error)
        return dispatch(authError({ message: error.message }));
      dispatch(authError({ message: UNKNOWN_ERROR }));
    }
  }
);

const registerAction = createAsyncThunk(
  "auth/registerAction",
  async (form: RegisterForm, { dispatch }) => {
    try {
      dispatch(authLoading(true));
      if (form.password.trim() !== form.confirmPassword.trim())
        return dispatch(
          authError({
            message: PASSWORD_NOT_MATCHED_WARNING,
          })
        );

      const result = await AuthApi.register(form);
      if (result.error)
        return dispatch(authError({ message: result.error.message }));

      return dispatch(
        authSuccess({
          credential: {
            token: result.data.token,
            currentUserId: result.data.currentUserId,
            profilePhoto: result.data.profilePhoto,
          },
          message: LOGINSUCESS,
        })
      );
    } catch (error: unknown) {
      if (error instanceof Error)
        return dispatch(authError({ message: error.message }));
      dispatch(authError({ message: UNKNOWN_ERROR }));
    }
  }
);

export { registerAction, loginAction };
