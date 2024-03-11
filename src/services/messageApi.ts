import { backendUrl } from "../utils/backendConfig";
import { ErrorResult, SuccessResult } from "../utils/resultHelperFunctions";
import { HttpResponse, Result } from "../utils/types";

const MessageApi = {
  getMessagesList: async (
    roomId: string,
    accessToken: string | null,
    currentUserId: string
  ): Promise<Result> => {
    try {
      if (!accessToken) return ErrorResult("Access Token required!");
      const res = await fetch(`${backendUrl}/messages`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUserId: currentUserId,
          roomId,
        }),
      });
      const result: HttpResponse = await res.json();
      console.log("messages ", result.data);

      if (result.status === "success") return SuccessResult(result.data);

      return ErrorResult(result.message);
    } catch (error) {
      return ErrorResult(error);
    }
  },

  deleteMessage: async ({
    messageId,
    bySender,
    friendId,
    currentUserId,
  }: {
    messageId: string;
    bySender: boolean;
    friendId: any;
    currentUserId: string;
  }) => {
    try {
      const res = await fetch(
        `${backendUrl}/messages/${
          bySender ? "bysender" : "byreceiver"
        }/${messageId}`,
        {
          method: "DELETE",
          body: JSON.stringify({
            userId: currentUserId,
            friendId: friendId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result: HttpResponse = await res.json();

      if (result.status === "success") return SuccessResult(result.data);
      return ErrorResult(result.message);
    } catch (error) {
      return ErrorResult(error);
    }
  },
};

export { MessageApi };
