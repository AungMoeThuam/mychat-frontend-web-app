import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import {
  deleteMessage,
  fetchMessagesListError,
  fetchMessagesListLoading,
  fetchMessagesListSuccess,
} from "../slices/messageSlice";
import { MessageApi } from "../../services/messageApi";
import { UNKNOWN_ERROR } from "../../utils/constants/messages/errorMessages";

const getMessagesListThunk = createAsyncThunk(
  "messages/getAll",
  async (roomId: string, { dispatch, getState }) => {
    try {
      dispatch(fetchMessagesListLoading(true));

      const { currentUserId, token } = (getState() as RootState).authSlice;
      const result = await MessageApi.getMessagesList(
        roomId,
        token,
        currentUserId
      );

      if (result.error)
        return dispatch(
          fetchMessagesListError({ message: result.error.message })
        );

      return dispatch(
        fetchMessagesListSuccess({ data: result.data, message: "Success!" })
      );
    } catch (error: unknown) {
      if (error instanceof Error)
        return dispatch(fetchMessagesListError({ message: error.message }));
      return dispatch(fetchMessagesListError({ message: UNKNOWN_ERROR }));
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
      const currentUserId = (getState() as RootState).authSlice.currentUserId;
      const result = await MessageApi.deleteMessage({
        messageId,
        bySender,
        friendId,
        currentUserId,
      });
      if (result.error) return;
      return dispatch(
        deleteMessage({ messageId, deleteBySender: result.data.deleteBySender })
      );
    } catch (error) {
      throw new Error("error occured!");
    }
  }
);

export { getMessagesListThunk, deleteMessageThunk };
