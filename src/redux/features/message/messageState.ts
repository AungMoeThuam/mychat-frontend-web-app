import { Message } from "../../../lib/models/models";

export type MessageState = {
  error: boolean;
  success: boolean;
  loading: boolean;
  messagesList: Message[];
  message: string;
};

const messageInitialState: MessageState = {
  error: false,
  success: false,
  loading: false,
  messagesList: [],
  message: "loading...",
};
export default messageInitialState;
