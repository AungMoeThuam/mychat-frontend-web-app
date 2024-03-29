import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "../../utils/types";

type SearchFriendState = {
  error: boolean;
  success: boolean;
  loading: boolean;
  poepleList: User[];
  message: string;
};

const initialState: SearchFriendState = {
  error: false,
  success: false,
  loading: false,
  poepleList: [],
  message: "loading...",
};

const searchFriendSlice = createSlice({
  name: "searchFriendSlice",
  initialState,
  reducers: {
    searchFriendLoading: (state) => {
      state.loading = true;
    },
    searchFriendSuccess: (state, action: PayloadAction<User[]>) => {
      state.poepleList = action.payload;
      state.loading = false;
    },
    searchFriendError: (state, action: PayloadAction<string>) => {
      state.error = true;
      state.loading = false;
      state.message = action.payload;
    },
    updateSearchFriends: (
      state,
      action: PayloadAction<{
        requester: string;
        receipent: string;
        status: number;
      }>
    ) => {
      state.poepleList = state.poepleList.map((person) => {
        if (person.requester === action.payload.requester) {
          person.status = action.payload.status;
          return person;
        } else return person;
      });
    },
  },
});

type FriendSliceState = ReturnType<typeof searchFriendSlice.reducer>;
type FriendSliceAction = typeof searchFriendSlice.actions;

export const {
  searchFriendSuccess,
  searchFriendError,
  updateSearchFriends,
  searchFriendLoading,
} = searchFriendSlice.actions;
export default searchFriendSlice.reducer;
export type { FriendSliceState, FriendSliceAction };
