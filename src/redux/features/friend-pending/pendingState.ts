import { Person } from "../../../lib/models/models";

type PendingState = {
  error: boolean;
  success: boolean;
  loading: boolean;
  pendingsList: Person[];
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
