import { Message } from "../../utils/types";

type MessageStateType = {
  error: boolean;
  success: boolean;
  loading: boolean;
  messagesList: Message[];
  message: string;
};

const messageInitialState: MessageStateType = {
  error: false,
  success: false,
  loading: false,
  messagesList: [],
  message: "loading...",
};
export default messageInitialState;
