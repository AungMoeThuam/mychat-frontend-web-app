import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  searchPeopleError,
  searchPeopleLoading,
  searchPeopleSuccess,
} from "./peopleSlice";
import { RootState } from "../../store/store";
import { FriendShipApi } from "../../../service/friend-api-service";
import { UNKNOWN_ERROR } from "../../../utils/constants/messages/errorMessages";

const searchfriendNameThunk = createAsyncThunk(
  "searchFriend/searchname",
  async (name: string, { dispatch, getState }) => {
    try {
      dispatch(searchPeopleLoading());
      let currentUserId = (getState() as RootState).authSlice.currentUserId;

      const result = await FriendShipApi.searchFriendsByName(
        name,
        currentUserId
      );
      if (result.error) return searchPeopleError(result.error);
      console.log(result.data);
      dispatch(searchPeopleSuccess(result.data));
    } catch (error: unknown) {
      if (error instanceof Error)
        return dispatch(searchPeopleError(error.message));
      return dispatch(searchPeopleError(UNKNOWN_ERROR));
    }
  }
);

export { searchfriendNameThunk };
