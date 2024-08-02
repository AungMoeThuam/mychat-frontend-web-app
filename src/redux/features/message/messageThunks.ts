import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import {
  deleteMessageSuccess,
  fetchMessagesError,
  fetchMessagesLoading,
  fetchMessagesSuccess,
} from "./messageSlice";
import { UNKNOWN_ERROR } from "../../../lib/constants/errorMessages";
import toast from "react-hot-toast";
import messageService from "../../../service/message.service";

const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (
    info: { roomId: string; friendId: string; lastMessageId?: string },
    { dispatch, getState }
  ) => {
    const { roomId, friendId, lastMessageId } = info;
    try {
      dispatch(fetchMessagesLoading(true));

      const { currentUserId } = (getState() as RootState).authSlice;
      const result = await messageService.getMessagesList(
        roomId,
        currentUserId,
        friendId,
        lastMessageId
      );

      if (result.error)
        return dispatch(fetchMessagesError({ message: result.error }));

      return dispatch(
        fetchMessagesSuccess({
          data: result.data,
          message: "Success!",
          pagination: lastMessageId != undefined,
        })
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
      const result = await messageService.deleteMessage({
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
      const result = await messageService.getMessagesList(
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
