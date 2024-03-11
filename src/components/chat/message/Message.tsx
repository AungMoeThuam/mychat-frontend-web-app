import "./style.css";
import { useState } from "react";
import DeleteMessageDialog from "../deletemessagedialog/DeleteMessageDialog";
import VideoMessageDisplay from "./VideoMessageDisplay";
import ImageMessageDisplay from "./ImageMessageDisplay";
import TextMessageDisplay from "./TextMessageDisplay";
import { BsTrashFill } from "react-icons/bs";
import { deleteMessageThunk } from "../../../redux/actions/messageThunks";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../../redux/store/store";
import { backendUrlWihoutApiEndpoint } from "../../../utils/backendConfig";
import pptx from "../../../assets/fileicons/ppt.png";
import pdf from "../../../assets/fileicons/pdf.png";
import docx from "../../../assets/fileicons/docx.png";

type MessageProps = {
  messageId: string;
  currentUserIsSender: boolean;
  content: string;
  type?: any;
  friendId: string;
  onViewImage?: () => void;
};
const files = ["pdf,", "doc", "docx", "pptx"];
function Message(props: { message: MessageProps }) {
  const {
    currentUserIsSender,
    messageId,
    type,
    onViewImage,
    content,
    friendId,
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
      }  my-1 relative`}
    >
      <div
        className={
          currentUserIsSender
            ? "chat-bubble shadow  lg:max-w-2xl text-sm text-white"
            : "chat-bubble   lg:max-w-2xl bg-teal-500 text-white relative"
        }
      >
        {type == "image" && (
          <ImageMessageDisplay
            onViewImage={() => alert("view")}
            content={content}
          />
        )}
        {type == "video" && <VideoMessageDisplay content={content} />}

        {type === "text" && <TextMessageDisplay content={content} />}
        {type === "file" && (
          <a
            className={`flex items-center gap-2 ${
              currentUserIsSender ? "text-white" : "text-slate-900"
            }`}
            href={`${backendUrlWihoutApiEndpoint}/resources/chats/${content}`}
            target="_blank"
            download
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
            {/* <FaFileAlt
              size={20}
              className={currentUserIsSender ? "text-white" : "text-slate-900"}
            /> */}
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
          onClick={openDeleteMessageDialog}
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
          className="absolute    text-teal-500 opacity-50"
        >
          <BsTrashFill size={20} />
        </menu>
      </div>
    </div>
  );
}

export default Message;
