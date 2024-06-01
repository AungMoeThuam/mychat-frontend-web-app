import { User } from "../../../utils/constants/types";

export type PeopleState = {
  error: boolean;
  success: boolean;
  loading: boolean;
  poepleList: User[];
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
