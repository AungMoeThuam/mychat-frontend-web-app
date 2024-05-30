import { AxiosError } from "axios";
import { UNKNOWN_ERROR } from "./constants/messages/errorMessages";
import { Result } from "./types";

export const SuccessResult = (data: any): Result => ({
  error: null,
  data,
});

export const ErrorResult = (errorMessage: unknown): Result => {
  if (errorMessage instanceof AxiosError)
    return {
      error: errorMessage.response?.data.error,
      data: null,
    };

  if (errorMessage instanceof Error)
    return { error: errorMessage.message, data: null };

  if (typeof errorMessage === "string")
    return {
      error: errorMessage,
      data: null,
    };

  return { error: UNKNOWN_ERROR, data: null };
};
