import { RegisterForm, Result } from "../lib/types/types";
import { ErrorResult, SuccessResult } from "../lib/utils/resultHelperFunctions";
import API from "./api";

const authService = {
  login: async (loginCredential: {
    email: string;
    password: string;
  }): Promise<Result> => {
    try {
      const result = await API.post("/user/login", loginCredential);
      return SuccessResult(result.data);
    } catch (error) {
      console.log(error);
      return ErrorResult(error);
    }
  },

  register: async (registerCredential: RegisterForm): Promise<Result> => {
    try {
      const result = await API.post("/user/register", registerCredential);
      return SuccessResult(result.data);
    } catch (error) {
      return ErrorResult(error);
    }
  },
};

export default authService;
