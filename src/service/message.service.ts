import toast from "react-hot-toast";
import { ErrorResult, SuccessResult } from "../lib/utils/resultHelperFunctions";
import { Event } from "../lib/utils/socketEvents";
import API from "./api";
import socket from "./socket.service";
import { Result } from "../lib/types/types";

function extractExtName(fileName: string) {
  if (!fileName.includes(".")) return "";
  let temp = fileName.split(".");
  let lastEle = temp[temp.length - 1];

  if (lastEle === "") return ".";

  return "." + lastEle;
}

const messageService = {
  getMessagesList: async (
    roomId: string,
    currentUserId: string,
    friendId: string,
    lastMessageId?: string
  ): Promise<Result> => {
    try {
      const res = await API.post(`/messages/v1`, {
        currentUserId: currentUserId,
        roomId,
        friendId,
        lastMessageId,
      });

      return SuccessResult(res.data);
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
      const res = await API.delete(
        `/messages/${bySender ? "bysender" : "byreceiver"}`,
        {
          data: {
            userId: currentUserId,
            friendId: friendId,
            messageId,
          },
        }
      );

      return SuccessResult(res.data);
    } catch (error) {
      return ErrorResult(error);
    }
  },
  sendMessage: async (messageToSend: {
    temporaryMessageId: string;
    content: string;
    type: string;
    senderId: string;
    receiverId: string;
    friendshipId: string;
    file?: File | null;
  }) => {
    try {
      //testing
      if (!messageToSend.file) {
        delete messageToSend.file;

        socket.emitEvent(Event.MESSAGE, messageToSend);
        return SuccessResult(true);
      }

      let extName = extractExtName(messageToSend.file.name);

      let filename = `${new Date().getTime()}${extName}`;

      const res = await API.post(`/fileupload`, messageToSend.file, {
        headers: {
          "Content-Type": "application/octet-stream",
          "X-filename": filename,
        },
        onUploadProgress: (event) => {
          const { loaded, total } = event;
          let percentage = Math.floor((loaded * 100) / total!);
          console.log("loaded is ", percentage);
        },
      });

      if (res.status !== 200) {
        toast("error!");
        return ErrorResult("failed to send");
      }

      messageToSend.content = filename;

      delete messageToSend.file;
      socket.emitEvent(Event.MESSAGE, messageToSend);

      return SuccessResult(true);
    } catch (error) {
      return ErrorResult(error);
    }
  },
};

export default messageService;
