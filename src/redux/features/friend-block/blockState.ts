import { Friend } from "../../../utils/constants/types";

type BlockState = {
  error: boolean;
  success: boolean;
  loading: boolean;
  blocksList: Friend[];
  message: string;
};

const blockInitialState: BlockState = {
  error: false,
  success: false,
  loading: false,
  blocksList: [],
  message: "loading...",
};
export default blockInitialState;
