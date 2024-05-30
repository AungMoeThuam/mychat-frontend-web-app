import "./style.css";
import { useState } from "react";
import DeleteMessageDialog from "../deletemessagedialog/DeleteMessageDialog";
import VideoMessageDisplay from "./VideoMessageDisplay";
import ImageMessageDisplay from "./ImageMessageDisplay";
import TextMessageDisplay from "./TextMessageDisplay";
import { BsSaveFill, BsTrashFill } from "react-icons/bs";
import { deleteMessageThunk } from "../../../../redux/actions/messageThunks";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../../../redux/store/store";
import { backendUrlWihoutApiEndpoint } from "../../../../utils/backendConfig";
import toast from "react-hot-toast";
import AudioMessageDisplay from "./audio-message-display/AudioMessageDisplay";
import FileMessageDisplay from "./FileMessageDisplay";

function isItAFile(type: any) {
  const t = ["video", "image", "text", "audio"];
  return !t.includes(type.split("/")[0]);
}
type MessageProps = {
  messageId: string;
  currentUserIsSender: boolean;
  content: string;
  type?: string;
  friendId: string;
  createdAt: string;
  status: number;
};
function Message(props: { message: MessageProps }) {
  const {
    currentUserIsSender,
    messageId,
    type,
    content,
    friendId,
    createdAt,
    status,
  } = props.message;
  const [deleteMessageDialog, setDeleteMessageDialog] = useState(false);
  const openDeleteMessageDialog = () => setDeleteMessageDialog(true);
  const dispatch = useDispatch<StoreDispatch>();
  const deleteMessage = () => {
    dispatch(
      deleteMessageThunk({
        messageId,
        friendId,
        bySender: currentUserIsSender,
      })
    );
  };

  return (
    <div
      data-id={messageId}
      id="message"
      className={` chat  my-1 relative  ${
        currentUserIsSender ? "chat-end" : "chat-start"
      }  `}
    >
      {status !== 9 ? (
        <div
          className={`flex flex-col ${
            currentUserIsSender ? "items-end " : "items-start"
          }  `}
        >
          <div
            className={`chat-bubble shadow-lg lg:max-w-2xl text-sm text-white ${
              !currentUserIsSender && "bg-teal-700 relative"
            } `}
          >
            {type?.includes("audio") && (
              <AudioMessageDisplay content={content} />
            )}
            {type?.includes("image") && (
              <ImageMessageDisplay content={content} />
            )}
            {type?.includes("video") && (
              <VideoMessageDisplay content={content} />
            )}
            {type?.includes("text") && <TextMessageDisplay content={content} />}
            {isItAFile(type) && <FileMessageDisplay content={content} />}

            {deleteMessageDialog && (
              <DeleteMessageDialog
                deleteMessageAction={deleteMessage}
                messageId={messageId}
                open={deleteMessageDialog}
                onClose={setDeleteMessageDialog}
              />
            )}

            <menu
              id="menu"
              style={
                currentUserIsSender
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
              <div className="flex flex-col justify-center items-center cursor-pointer  gap-3 ">
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
          <small className=" text-slate-500  text-xs">
            {new Date(createdAt).toLocaleString()}
            {currentUserIsSender &&
              (status === 0 ? "sent" : status === 1 ? "delivered" : "seen")}
          </small>
        </div>
      ) : (
        "sending...."
      )}
    </div>
  );
}

export default Message;
