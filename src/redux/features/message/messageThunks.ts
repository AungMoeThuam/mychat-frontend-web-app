import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import {
  deleteMessageSuccess,
  fetchMessagesError,
  fetchMessagesLoading,
  fetchMessagesSuccess,
} from "./messageSlice";
import { MessageApi } from "../../../service/message-api-service";
import { UNKNOWN_ERROR } from "../../../utils/constants/messages/errorMessages";
import toast from "react-hot-toast";

const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (
    info: { roomId: string; friendId: string },
    { dispatch, getState }
  ) => {
    const { roomId, friendId } = info;
    try {
      dispatch(fetchMessagesLoading(true));

      const { currentUserId } = (getState() as RootState).authSlice;
      const result = await MessageApi.getMessagesList(
        roomId,
        currentUserId,
        friendId
      );

      if (result.error)
        return dispatch(fetchMessagesError({ message: result.error }));

      return dispatch(
        fetchMessagesSuccess({ data: result.data, message: "Success!" })
      );
    } catch (error: unknown) {
      if (error instanceof Error)
        return dispatch(fetchMessagesError({ message: error.message }));
      return dispatch(fetchMessagesError({ message: UNKNOWN_ERROR }));
    }
  }
);

const deleteMessage = createAsyncThunk(
  "messages/deleteMessage",
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
      const currentUserId = (getState() as RootState).authSlice.currentUserId;
      const result = await MessageApi.deleteMessage({
        messageId,
        bySender,
        friendId,
        currentUserId,
      });

      if (result.error) return toast(result.error);

      return dispatch(
        deleteMessageSuccess({
          messageId,
          deleteBySender: result.data.deleteBySender,
        })
      );
    } catch (error) {
      throw new Error("error occured!");
    }
  }
);

const fetchMessagesInBackground = createAsyncThunk(
  "messages/fetchMessagesInBackground",
  async (
    info: { roomId: string; friendId: string },
    { dispatch, getState }
  ) => {
    const { roomId, friendId } = info;
    try {
      const { currentUserId } = (getState() as RootState).authSlice;
      const result = await MessageApi.getMessagesList(
        roomId,
        currentUserId,
        friendId
      );

      if (result.error)
        return dispatch(fetchMessagesError({ message: result.error }));

      return dispatch(
        fetchMessagesSuccess({ data: result.data, message: "Success!" })
      );
    } catch (error: unknown) {
      if (error instanceof Error)
        return dispatch(fetchMessagesError({ message: error.message }));
      return dispatch(fetchMessagesError({ message: UNKNOWN_ERROR }));
    }
  }
);

export { fetchMessagesInBackground, fetchMessages, deleteMessage };
