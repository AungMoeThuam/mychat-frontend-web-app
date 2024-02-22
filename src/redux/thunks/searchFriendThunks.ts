import { createAsyncThunk } from "@reduxjs/toolkit";
import { searchFriendByName } from "../slice/searchFriendSlice";
import { backendUrl } from "../../utils/backendConfig";
import { RootState } from "../store/store";

const searchfriendNameThunk = createAsyncThunk(
  "searchFriend/searchname",
  async (name: string, { dispatch, getState }) => {
    try {
      // if (!name.trim()) {
      //   dispatch(searchFriendByName([]));
      //   return;
      // }

      let currentUserId = (getState() as RootState).authSlice.currentUserId;

      if (name.trim() == "") return { data: [] };

      const res = await fetch(
        backendUrl + `/users/search?name=${name}&userId=${currentUserId}`,
        {
          method: "POST",
        }
      );

      let { status, data } = await res.json();

      console.log(" searchthunk ", data);
      if (status === "success") {
        dispatch(searchFriendByName(data));
      }
    } catch (error: any) {}
  }
);

export { searchfriendNameThunk };
