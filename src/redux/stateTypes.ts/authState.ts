import { ProfilePhoto } from "../../utils/types";

type AuthState = {
  error: boolean;
  success: boolean;
  loading: boolean;
  token: string | null;
  message: string;
  currentUserId: string;
  profilePhoto: ProfilePhoto;
};

const authInitialState: AuthState = {
  error: false,
  success: false,
  loading: false,
  token: null,
  currentUserId: "",
  profilePhoto: {},
  message: "loading...",
};
export default authInitialState;
