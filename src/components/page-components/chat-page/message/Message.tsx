import "./style.css";
import { memo, useState } from "react";
import DeleteMessageDialog from "../delete-message-dialog/DeleteMessageDialog";
import ImageMessageDisplay from "./ImageMessageDisplay";
import { BsSaveFill, BsTrashFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../../../redux/store/store";
import { backendUrlWihoutApiEndpoint } from "../../../../utils/backendConfig";
import toast from "react-hot-toast";
import FileMessageDisplay from "./FileMessageDisplay";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { deleteMessage } from "../../../../redux/features/message/messageThunks";
import AudioMessageDisplay from "./audio-message-display/AudioMessageDisplay";
import VideoMessageDisplay from "./VideoMessageDisplay";
import TextMessageDisplay from "./TextMessageDisplay";
import { Message as MSG } from "../../../../lib/models/models";

function isItAFile(type: any) {
  const t = ["video", "image", "text", "audio"];
  return !t.includes(type.split("/")[0]);
}
type MessageProps = {
  message: MSG;
  currentUserId: string;
  previousMessageDate: null | string;
};
const M = memo(Message);
function Message({
  message,
  currentUserId,
  previousMessageDate,
}: MessageProps) {
  const {
    messageId,
    type,
    content,
    createdAt,
    deliveryStatus,
    senderId,
    receiverId,
  } = message;
  const isCurrentUserTheSender = senderId === currentUserId;
  const friendId = isCurrentUserTheSender ? receiverId : senderId;
  const [deleteMessageDialog, setDeleteMessageDialog] = useState(false);
  const openDeleteMessageDialog = () => setDeleteMessageDialog(true);
  const dispatch = useDispatch<StoreDispatch>();
  const deleteMessageAction = () => {
    dispatch(
      deleteMessage({
        messageId,
        friendId,
        bySender: isCurrentUserTheSender,
      })
    );
  };
  let prev = previousMessageDate
    ? new Date(previousMessageDate).toLocaleString().split(",")[0]
    : null;
  let cur = new Date(createdAt).toLocaleString().split(",")[0];
  return (
    <div
      data-id={messageId}
      id="message"
      className={` chat  my-1 relative flex flex-col   ${
        isCurrentUserTheSender ? "chat-end" : "chat-start"
      }  `}
    >
      {deliveryStatus !== 9 ? (
        <div
          className={`flex flex-col justify-center w-full   ${
            isCurrentUserTheSender ? "items-end " : "items-start"
          }  `}
        >
          <div
            className={`chat-bubble shadow-lg max-w-xs lg:max-w-2xl text-sm  bg-teal-500  break-words ${
              !isCurrentUserTheSender
                ? " bg-zinc-800 text-white dark:bg-zinc-800"
                : "  bg-gradient-to-r from-lime-500 to-teal-500 text-slate-950 "
            } `}
          >
            {type?.includes("audio") && (
              <AudioMessageDisplay content={content} />
            )}
            {type?.includes("image") && (
              <ImageMessageDisplay content={content} />
            )}
            {type?.includes("video") && (
              <VideoMessageDisplay content={content} type={type} />
            )}
            {type?.includes("text") && <TextMessageDisplay content={content} />}
            {isItAFile(type) && <FileMessageDisplay content={content} />}

            {deleteMessageDialog && (
              <DeleteMessageDialog
                deleteMessageAction={deleteMessageAction}
                messageId={messageId}
                open={deleteMessageDialog}
                onClose={setDeleteMessageDialog}
              />
            )}

            <menu
              id="menu"
              style={
                isCurrentUserTheSender
                  ? {
                      left: "-8dvh",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }
                  : {
                      right: "-8dvh",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }
              }
              className="absolute  text-teal-500 opacity-50"
            >
              <div className="flex flex-col justify-center items-center cursor-pointer  text-lime-500 gap-3 ">
                <BsTrashFill onClick={openDeleteMessageDialog} size={20} />
                {!type?.includes("text") && (
                  <BsSaveFill
                    onClick={async (e) => {
                      e.preventDefault();
                      let a: HTMLAnchorElement | null =
                        document.createElement("a");

                      let b = await fetch(
                        `${backendUrlWihoutApiEndpoint}/resources/chats/${content}`
                      );
                      let c = await b.blob();
                      a.href = URL.createObjectURL(c);
                      a.download = content;
                      a.target = "_blank";
                      a.click();
                      a = null;
                      toast("Save a file ✅ ");
                    }}
                    size={20}
                  />
                )}
              </div>
            </menu>
          </div>
        </div>
      ) : (
        <div className=" chat-bubble  flex items-center ">
          <AiOutlineLoading3Quarters className="animate-spin  h-5 w-5 mr-3 ..." />

          {"sending..."}
        </div>
      )}
      <small className=" text-slate-500 self-center  text-xs flex flex-col w-full">
        <span className=" self-center ">
          {prev !== cur && new Date(createdAt).toLocaleString()}
        </span>
        <span className=" self-end">
          {isCurrentUserTheSender &&
            (deliveryStatus === 0
              ? "sent"
              : deliveryStatus === 1
              ? "delivered"
              : "seen")}
        </span>
      </small>
    </div>
  );
}

export default M;
