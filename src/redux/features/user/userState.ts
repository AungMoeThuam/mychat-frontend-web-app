import { ProfilePhoto } from "../../../utils/constants/types";

export type UserState = {
  error: boolean;
  success: boolean;
  loading: boolean;
  token: string | null;
  message: string;
  currentUserId: string;
  profilePhoto: ProfilePhoto;
};

const userInitialState: UserState = {
  error: false,
  success: false,
  loading: false,
  token: null,
  currentUserId: "",
  profilePhoto: {},
  message: "loading...",
};

export default userInitialState;
