import { Friend } from "../../utils/types";

type PendingState = {
  error: boolean;
  success: boolean;
  loading: boolean;
  pendingsList: Friend[];
  message: string;
};

const pendingInitialState: PendingState = {
  error: false,
  success: false,
  loading: false,
  pendingsList: [],
  message: "loading...",
};
export default pendingInitialState;
