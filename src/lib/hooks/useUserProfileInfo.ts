import { useEffect, useState } from "react";
import { User } from "../types/types";
import userService from "../../service/user.service";

type UserState = {
  loading: boolean;
  error: boolean;
  message: string;
  data: User;
};
export default function useUserProfileInfo(currentUserId: string): UserState {
  const [userInfo, setUserInfo] = useState<UserState>({
    loading: false,
    error: false,
    message: "",
    data: {
      name: "",
      email: "",
      id: "",
      isActiveNow: false,
      profilePhoto: null,
      phone: "",
    },
  });
  useEffect(() => {
    async function fetchUserInfo() {
      setUserInfo((prev) => ({ ...prev, loading: true }));
      try {
        const result = await userService.getUserInfo(currentUserId);
        if (result.error)
          return setUserInfo((prev) => ({
            ...prev,
            loading: false,
            error: true,
            message: result.error ? result.error : "Unknown Error!",
          }));
        return setUserInfo((prev) => ({
          ...prev,
          loading: false,
          data: result.data,
        }));
      } catch (error: any) {
        return setUserInfo((prev) => ({
          ...prev,
          loading: false,
          error: true,
          message: error.message,
        }));
      }
    }

    fetchUserInfo();
  }, []);
  return {
    error: userInfo.error,
    loading: userInfo.loading,
    message: userInfo.message,
    data: userInfo.data,
  };
}
