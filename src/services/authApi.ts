import { backendUrl } from "../utils/backendConfig";
import { ErrorResult, SuccessResult } from "../utils/resultHelperFunctions";
import { HttpResponse, RegisterForm, Result } from "../utils/types";

const AuthApi = {
  login: async (loginCredential: {
    email: string;
    password: string;
  }): Promise<Result> => {
    try {
      const res = await fetch(backendUrl + "/user/login", {
        method: "POST",
        body: JSON.stringify(loginCredential),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result: HttpResponse = await res.json();

      if (result.status === "success") return SuccessResult(result.data);

      return ErrorResult(result.message);
    } catch (error: any) {
      return ErrorResult(error);
    }
  },
  register: async (registerCredential: RegisterForm): Promise<Result> => {
    try {
      const res = await fetch(backendUrl + "/user/register", {
        method: "POST",
        body: JSON.stringify(registerCredential),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result: HttpResponse = await res.json();

      if (result.status === "success") return SuccessResult(result.data);

      return ErrorResult({ message: result.message });
    } catch (error) {
      return ErrorResult(error);
    }
  },
};

export { AuthApi };
