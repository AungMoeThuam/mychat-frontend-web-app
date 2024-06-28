import { Person } from "../../../lib/models/models";

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
