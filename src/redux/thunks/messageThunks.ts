import { backendUrl } from "../../utils/backendConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "../store/store";
import {
  fetchMessagesListError,
  fetchMessagesListLoading,
  fetchMessagesListSuccess,
} from "../slice/messageSlice";

const getMessagesListThunk = createAsyncThunk(
  "messages/getAll",
  async (roomId: string, { dispatch, getState }) => {
    try {
      const rootState: RootState = getState() as RootState;
      dispatch(fetchMessagesListLoading(true));
      const res = await fetch(`${backendUrl}/messages`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + rootState.authSlice.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUserId: rootState.authSlice.currentUserId,
          roomId,
        }),
      });
      const result = await res.json();

      if (result.status === "success") {
        const { data, message } = result;
        dispatch(fetchMessagesListSuccess({ data, message }));
      } else if (result.status === "error") {
        dispatch(fetchMessagesListError({ message: result.message }));
      }
    } catch (error: any) {
      dispatch(fetchMessagesListError({ message: error.message }));
    }
  }
);

const deleteMessageThunk = createAsyncThunk(
  "messages/delete",
  async (
    {
      messageId,
      bySender,
      friendId,
    }: {
      messageId: string;
      bySender: boolean;

      friendId: any;
    },
    { dispatch, getState }
  ) => {
    try {
      const res = await fetch(
        `${backendUrl}/messages/${
          bySender ? "bysender" : "byreceiver"
        }/${messageId}`,
        {
          method: "DELETE",
          body: JSON.stringify({
            userId: (getState() as RootState).authSlice.currentUserId,
            friendId: friendId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      console.log(data);
    } catch (error) {
      throw new Error("error occured!");
    }
  }
);

export { getMessagesListThunk, deleteMessageThunk };
