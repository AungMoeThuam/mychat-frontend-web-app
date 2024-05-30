import { useEffect, useState } from "react";
import { UserApi } from "../services/userApi";

export default function useUserProfileInfo(currentUserId: string) {
  const [userInfo, setUserInfo] = useState({
    loading: false,
    error: false,
    message: "",
    data: { name: "", email: "", _id: "", phone: "" },
  });
  useEffect(() => {
    async function fetchUserInfo() {
      setUserInfo((prev) => ({ ...prev, loading: true }));
      try {
        const result = await UserApi.getUserInfo(currentUserId);
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
