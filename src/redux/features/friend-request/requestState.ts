import { Person } from "../../../lib/models/models";

type RequestState = {
  error: boolean;
  success: boolean;
  loading: boolean;
  requestsList: Person[];
  message: string;
};

const requestInitialState: RequestState = {
  error: false,
  success: false,
  loading: false,
  requestsList: [],
  message: "loading...",
};
export default requestInitialState;
