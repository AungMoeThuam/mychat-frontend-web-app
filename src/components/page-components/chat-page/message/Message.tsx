import "./style.css";
import { memo, useRef } from "react";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../../../redux/store/store";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { deleteMessage } from "../../../../redux/features/message/messageThunks";
import { Message as MSG } from "../../../../lib/types/types";
import Dialog from "../../../share-components/Dialog";
import Button from "../../../share-components/Button";
import MessageContent from "./MessageContent";
import MessageActionMenu from "./MessageActionMenu";
import MessageDeliveryStatus from "./MessageDeliveryStatus";
import MessageDate from "./MessageDate";

interface MessageProps {
  message: MSG;
  currentUserId: string;
  previousMessageDate: null | string;
}
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
  const dispatch = useDispatch<StoreDispatch>();
  const dialog = useRef<HTMLDialogElement>(null);

  const deleteMessageHandler = () => {
    dispatch(
      deleteMessage({
        messageId,
        friendId,
        bySender: isCurrentUserTheSender,
      })
    );
    dialog.current?.close();
  };
  return (
    <div
      data-id={messageId}
      id="message"
      className={isCurrentUserTheSender ? "send-message" : "receive-message"}
    >
      {deliveryStatus !== 9 ? (
        <div
          className={`flex flex-col justify-center w-full   ${
            isCurrentUserTheSender ? "items-end " : "items-start"
          }  `}
        >
          <div
            className={`${
              type?.includes("video") || type?.includes("image")
                ? " rounded-lg p-1 relative"
                : "chat-bubble relative"
            } shadow-lg max-w-xs lg:max-w-2xl text-sm break-words  bg-teal-500${
              !isCurrentUserTheSender
                ? " bg-zinc-800 text-white dark:bg-zinc-800"
                : "  bg-gradient-to-r from-lime-500 to-teal-500 text-slate-950 "
            } `}
          >
            <MessageContent type={type} content={content} />

            <Dialog dialogRef={dialog}>
              Are u sure to delete this message?
              <div className="flex  items-center justify-center gap-4 ">
                <Button onClick={deleteMessageHandler} type="warning">
                  Yes
                </Button>
                <Button onClick={() => dialog.current?.close()}>No</Button>
              </div>
            </Dialog>
            <MessageActionMenu
              isCurrentUserTheSender={isCurrentUserTheSender}
              type={type}
              deleteMessageDialog={dialog}
              content={content}
            />
          </div>
        </div>
      ) : (
        <div className=" chat-bubble  flex items-center ">
          <AiOutlineLoading3Quarters className="animate-spin  h-5 w-5 mr-3 ..." />
          {"sending..."}
        </div>
      )}
      <small className=" text-slate-500 self-center  text-xs flex flex-col w-full">
        <MessageDate
          previousMessageDate={previousMessageDate}
          createdAt={createdAt}
        />
        <MessageDeliveryStatus
          deliveryStatus={deliveryStatus}
          isCurrentUserTheSender={isCurrentUserTheSender}
        />
      </small>
    </div>
  );
}

export default memo(Message);
