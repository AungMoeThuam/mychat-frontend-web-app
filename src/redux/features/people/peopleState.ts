import { Person } from "../../../lib/types/types";

export type PeopleState = {
  error: boolean;
  success: boolean;
  loading: boolean;
  poepleList: Person[];
  message: string;
};

const peopleInitialState: PeopleState = {
  error: false,
  success: false,
  loading: false,
  poepleList: [],
  message: "loading...",
};

export default peopleInitialState;
