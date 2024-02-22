import { RegisterForm } from "../../pages/register/Register.page";
import { backendUrl } from "../../utils/backendConfig";
import { HttpResponse } from "../../utils/types";
import { authError, authLoading, authSuccess } from "../slice/authSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";

const loginThunk = createAsyncThunk(
  "auth/login",
  async (form: any, { dispatch }) => {
    try {
      dispatch(authLoading(true));
      const res = await fetch(backendUrl + "/user/login", {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();

      if (result.status === "success") {
        dispatch(
          authSuccess({
            credential: {
              token: result.data.token,
              currentUserId: result.data.currentUserId,
              profilePhoto: result.data.profilePhoto,
            },
            message: result.message,
          })
        );
      } else if (result.status === "error") {
        dispatch(authError({ message: result.message }));
      }
    } catch (error: any) {
      dispatch(authError({ message: error.message }));
    }
  }
);

const registerThunk = createAsyncThunk(
  "auth/register",
  async (form: RegisterForm, { dispatch }) => {
    try {
      dispatch(authLoading(true));
      const res = await fetch(backendUrl + "/user/register", {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result: HttpResponse = await res.json();
      console.log("result auth = ", result);
      if (result.status === "error") {
        dispatch(authError({ message: result.message }));
      } else {
        dispatch(
          authSuccess({
            credential: {
              token: result.data.token,
              currentUserId: result.data.currentUserId,
              profilePhoto: result.data.profilePhoto,
            },
            message: result.message,
          })
        );
      }
    } catch (error: any) {
      dispatch(authError({ message: error.message }));
    }
  }
);

export { loginThunk, registerThunk };
