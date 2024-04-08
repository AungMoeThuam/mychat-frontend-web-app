import { backendUrl } from "../utils/backendConfig";
import containsNonISO8859Characters from "../utils/containsNonISO8859Characters";
import { ErrorResult, SuccessResult } from "../utils/resultHelperFunctions";
import { Event } from "../utils/socketEvents";
import { HttpResponse, Result } from "../utils/types";
import socket from "./socket";

const MessageApi = {
  getMessagesList: async (
    roomId: string,
    accessToken: string | null,
    currentUserId: string,
    friendId: string
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
          friendId,
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
        `${backendUrl}/messages/${bySender ? "bysender" : "byreceiver"}`,
        {
          method: "DELETE",
          body: JSON.stringify({
            userId: currentUserId,
            friendId: friendId,
            messageId,
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
  sendMessage: async (messageToSend: {
    content: string;
    type: string;
    senderId: string;
    receiverId: string;
    roomId: string;
    createdAt: number;
    file?: File | null;
  }) => {
    try {
      if (!messageToSend.file) {
        console.log(" m before", messageToSend);

        delete messageToSend.file;
        console.log(" m ", messageToSend);
        socket.emitEvent(Event.MESSAGE, messageToSend);
        return SuccessResult(true);
      }

      let filename = containsNonISO8859Characters(messageToSend.file.name)
        ? `${new Date().getTime()}.${messageToSend.file.name.split(".")[1]}`
        : `${new Date().getTime()}.${messageToSend.file.name.split(".")[1]}`;

      const res = await fetch(`${backendUrl}/fileupload`, {
        method: "POST",
        body: messageToSend.file,
        headers: {
          "Content-Type": "application/octet-stream",
          "X-filename": filename,
        },
      });

      messageToSend.content = filename;

      delete messageToSend.file;
      socket.emitEvent(Event.MESSAGE, messageToSend);

      return SuccessResult(true);
    } catch (error) {
      return ErrorResult(error);
    }
  },
};

export { MessageApi };
