import userApiService from "../../../service/user-api-service";
import {
  PASSWORD_NOT_MATCHED_WARNING,
  UNKNOWN_ERROR,
} from "../../../utils/constants/messages/errorMessages";
import { LOGINSUCESS } from "../../../utils/constants/messages/sucessMessages";
import { RegisterForm } from "../../../utils/constants/types";
import { loginError, loginLoading, loginSuccess } from "./userSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";

const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (form: { email: string; password: string }, { dispatch }) => {
    try {
      dispatch(loginLoading(true));
      const result = await userApiService.login(form);
      if (result.error) return dispatch(loginError({ message: result.error }));

      return dispatch(
        loginSuccess({
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
        return dispatch(loginError({ message: error.message }));
      if (er) dispatch(loginError({ message: UNKNOWN_ERROR }));
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

      const result = await userApiService.register(form);
      if (result.error) return dispatch(loginError({ message: result.error }));

      return dispatch(
        loginSuccess({
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
        return dispatch(loginError({ message: error.message }));
      dispatch(loginError({ message: UNKNOWN_ERROR }));
    }
  }
);

export { registerUser, loginUser };
