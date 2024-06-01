import { createSlice } from "@reduxjs/toolkit";
import peopleInitialState from "./peopleState";
import peopleReducers from "./peopleReducers";

const peopleSlice = createSlice({
  name: "peopleSlice",
  initialState: peopleInitialState,
  reducers: peopleReducers,
});

type PeopleSliceState = ReturnType<typeof peopleSlice.reducer>;
type PeopleSliceAction = typeof peopleSlice.actions;

export const {
  searchPeopleError,
  searchPeopleLoading,
  searchPeopleSuccess,
  updateSearchingPeopleResult,
} = peopleSlice.actions;
export default peopleSlice.reducer;
export type { PeopleSliceState, PeopleSliceAction };
