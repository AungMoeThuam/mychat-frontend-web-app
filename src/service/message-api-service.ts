import toast from "react-hot-toast";
import { ErrorResult, SuccessResult } from "../utils/resultHelperFunctions";
import { Event } from "../utils/constants/socketEvents";
import { Result } from "../utils/constants/types";
import API from "./api-setup";
import socket from "./socket";

const MessageApi = {
  getMessagesList: async (
    roomId: string,
    currentUserId: string,
    friendId: string
  ): Promise<Result> => {
    try {
      const res = await API.post(`/messages`, {
        currentUserId: currentUserId,
        roomId,
        friendId,
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
    roomId: string;
    file?: File | null;
  }) => {
    try {
      //testing
      if (!messageToSend.file) {
        delete messageToSend.file;

        socket.emitEvent(Event.MESSAGE, messageToSend);
        return SuccessResult(true);
      }

      let t = messageToSend.file.name.split(".");
      let iss =
        t.length > 2
          ? t[0] +
            "." +
            t.filter((e) => e === "mp4" || e === "mkv" || e === "ts").join("")
          : messageToSend.file.name;

      let filename = `${new Date().getTime()}.${iss.split(".")[1]}`;

      const res = await API.post(`/fileupload`, messageToSend.file, {
        headers: {
          "Content-Type": "application/octet-stream",
          "X-filename": filename,
        },
        onUploadProgress: (event) => {
          const { loaded, total } = event;
          let percentage = Math.floor((loaded * 100) / total);
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

export { MessageApi };
