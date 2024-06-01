import { Friend } from "../../../utils/constants/types";

type RequestState = {
  error: boolean;
  success: boolean;
  loading: boolean;
  requestsList: Friend[];
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
