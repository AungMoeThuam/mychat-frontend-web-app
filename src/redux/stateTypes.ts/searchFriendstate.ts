import { User } from "../../utils/types";

type SearchFriendState = {
  error: boolean;
  success: boolean;
  loading: boolean;
  poepleList: User[];
  message: string;
};

const searchFriendInitialState: SearchFriendState = {
  error: false,
  success: false,
  loading: false,
  poepleList: [],
  message: "loading...",
};

export default searchFriendInitialState;
