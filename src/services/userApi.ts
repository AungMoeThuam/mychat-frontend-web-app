import { backendUrl } from "../utils/backendConfig";
import { ErrorResult, SuccessResult } from "../utils/resultHelperFunctions";
import { HttpResponse, Result } from "../utils/types";

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

      const res = await fetch(`${backendUrl}/profileupload`, {
        method: "POST",
        body: form,
      });
      const result: HttpResponse = await res.json();

      if (result.status === "success") return SuccessResult(result.data);

      return ErrorResult(result.message);
    } catch (error) {
      return ErrorResult(error);
    }
  },

  getUserInfo: async (currentUserId: string) => {
    try {
      const res = await fetch(`${backendUrl}/user/${currentUserId}`, {
        method: "GET",
      });
      const result: HttpResponse = await res.json();
      if (result.status === "success") return SuccessResult(result.data);

      return ErrorResult(result.message);
    } catch (error) {
      return ErrorResult(error);
    }
  },
};

export { UserApi };
