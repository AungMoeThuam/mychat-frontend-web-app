import { ErrorResult, SuccessResult } from "../utils/resultHelperFunctions";
import { Result } from "../utils/constants/types";
import API from "./api-setup";

const UserApi = {
  uploadProfilePhoto: async (
    photo: File,
    currentUserId: string
  ): Promise<Result> => {
    try {
      const form = new FormData();
      form.append("uploadPhoto", photo);
      form.append("filename", photo.name);
      form.append("userId", currentUserId);

      const { data } = await API.post(`/profileupload`, form);
      return SuccessResult(data);
    } catch (error) {
      return ErrorResult(error);
    }
  },

  getUserInfo: async (currentUserId: string) => {
    try {
      const { data } = await API.get(`/user/${currentUserId}`);
      return SuccessResult(data);
    } catch (error) {
      return ErrorResult(error);
    }
  },
};

export { UserApi };
