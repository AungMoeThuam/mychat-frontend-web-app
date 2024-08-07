import { Friend } from "../../../lib/types/types";

export type FriendState = {
  error: boolean;
  success: boolean;
  loading: boolean;
  friendsList: Friend[];
  message: string;
};

const friendInitialState: FriendState = {
  error: false,
  success: false,
  loading: false,
  friendsList: [],
  message: "loading...",
};

export default friendInitialState;
