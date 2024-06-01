import { PayloadAction } from "@reduxjs/toolkit";
import { PeopleState } from "./peopleState";
import { User } from "../../../utils/constants/types";

const peopleReducers = {
  searchPeopleLoading: (state: PeopleState) => {
    state.loading = true;
  },
  searchPeopleSuccess: (state: PeopleState, action: PayloadAction<User[]>) => {
    state.poepleList = action.payload;
    state.loading = false;
  },
  searchPeopleError: (state: PeopleState, action: PayloadAction<string>) => {
    state.error = true;
    state.loading = false;
    state.message = action.payload;
  },
  updateSearchingPeopleResult: (
    state: PeopleState,
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
};

export default peopleReducers;
