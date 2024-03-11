import { UNKNOWN_ERROR } from "./constants/messages/errorMessages";
import { Result } from "./types";

export const SuccessResult = (data: any): Result => ({ error: null, data });

export const ErrorResult = (errorMessage: unknown | Error): Result => {
  if (errorMessage instanceof Error)
    return { error: { message: errorMessage.message }, data: null };
  if (typeof errorMessage === "string")
    return {
      error: { message: errorMessage },
      data: null,
    };

  return { error: { message: UNKNOWN_ERROR }, data: null };
};
