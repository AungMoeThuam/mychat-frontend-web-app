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
import pptx from "../../../../assets/fileicons/ppt.png";
import pdf from "../../../../assets/fileicons/pdf.png";
import docx from "../../../../assets/fileicons/docx.png";
import toast from "react-hot-toast";
import AudioMessageDisplay from "./audio-message-display/AudioMessageDisplay";

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
      className={` chat  ${
        currentUserIsSender ? "chat-end" : "chat-start"
      }  my-1 relative `}
    >
      <div className="flex flex-col  items-end">
        <div
          className={
            currentUserIsSender
              ? "chat-bubble shadow  lg:max-w-2xl text-sm text-white"
              : "chat-bubble   lg:max-w-2xl bg-teal-700 text-white relative"
          }
        >
          {type?.split("/")[0] == "audio" && (
            <AudioMessageDisplay content={content} setFile={() => null} />
          )}
          {type?.split("/")[0] == "image" && (
            <ImageMessageDisplay content={content} />
          )}
          {type?.split("/")[0] == "video" && (
            <VideoMessageDisplay content={content} />
          )}
          {type === "text" && <TextMessageDisplay content={content} />}
          {type?.split("/")[0] !== "image" &&
            type?.split("/")[0] !== "video" &&
            type !== "text" &&
            type?.split("/")[0] !== "audio" && (
              <a
                className={`flex items-center gap-2 ${
                  currentUserIsSender ? "text-white" : "text-slate-900"
                }`}
              >
                {content.split(".")[1] === "pptx" && (
                  <img className="w-8" src={pptx} alt="" />
                )}
                {content.split(".")[1] === "pdf" && (
                  <img className="w-8" src={pdf} alt="" />
                )}
                {content.split(".")[1] === "docx" && (
                  <img className="w-8" src={docx} alt="" />
                )}

                {content}
              </a>
            )}
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
              {type !== "text" && (
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
                    console.log("assertion ", c instanceof Blob);
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
          {new Date(createdAt).toLocaleString()}{" "}
          {currentUserIsSender &&
            (status === 0 ? "sent" : status === 1 ? "delivered" : "seen")}
        </small>
      </div>
    </div>
  );
}

export default Message;
