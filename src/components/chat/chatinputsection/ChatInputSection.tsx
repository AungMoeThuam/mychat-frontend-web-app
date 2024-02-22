import { FormEvent, useEffect, useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { ImSmile } from "react-icons/im";
import Picker from "@emoji-mart/react";
import { FiPaperclip } from "react-icons/fi";
import { Event, imageTypes, videoTypes } from "../../../utils/contants";
import MessageInput from "../messageInput/MessageInput";
import "./style.css";
import generateVideoThumbnail from "../../../utils/generateThumbnail";
import SelectFileDisplay from "./SelectFileDisplay";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import socket from "../../../services/socket";
import { backendUrl } from "../../../utils/backendConfig";
import containsNonISO8859Characters from "../../../utils/containsNonISO8859Characters";
type Message = {
  content: any;
  senderId: any;
  receiverId: string;
  type: "image" | "video" | "text" | "others";
  roomId: string;
  createdAt: Number;
};

export default function ChatInput(props: {
  friendId: any;
  roomId: any;
  onSendMessage: any;
}) {
  const [file, setFile] = useState<File | null>(null);
  const { currentUserId } = useSelector((state: RootState) => state.authSlice);

  const [message, setMessage] = useState("");
  const textInputRef = useRef<HTMLParagraphElement>(null);
  const fileDisplayRef = useRef<HTMLImageElement>(null);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [input, setInput] = useState("");
  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (textInputRef?.current?.innerText.trim() == "") return;
    let messageToSend: Message;
    if (file != null) {
      const videoType = videoTypes.includes(file.type.split("/")[1]);
      const imageType = imageTypes.includes(file.type.split("/")[1]);
      const fileType = !videoType && !imageType ? "file" : false;
      let type: any = "others";
      if (videoType) type = "video";
      else if (imageType) type = "image";
      else if (fileType) type = fileType;

      messageToSend = {
        content: file.name,
        type: type,
        senderId: currentUserId,
        receiverId: props.friendId,
        roomId: props.roomId,
        createdAt: Date.now(),
      };
    } else {
      messageToSend = {
        content: textInputRef?.current?.innerText.toString(),
        type: "text",
        senderId: currentUserId,
        receiverId: props.friendId,
        roomId: props.roomId,
        createdAt: Date.now(),
      };
    }

    let filename: any;
    if (file != null) {
      filename = containsNonISO8859Characters(file.name)
        ? `${new Date().getTime()}.${file.name.split(".")[1]}`
        : `${new Date().getTime()}.${file.name.split(".")[1]}`;
      const res = await fetch(`${backendUrl}/fileupload`, {
        method: "POST",
        body: file,
        headers: {
          "Content-Type": "application/octet-stream",
          "X-filename": filename?.toString(),
        },
      });

      await Promise.all([res]).then((value) => {
        messageToSend.content = filename;
      });

      console.log("file", file);

      socket.emitEvent(Event.MESSAGE, messageToSend);
      if (file != null) setFile(null);
      if (textInputRef && textInputRef.current) {
        textInputRef.current.innerText = "";
      }
      return;
    }

    socket.emitEvent(Event.MESSAGE, messageToSend);
    // props.onSendMessage(messageToSend, file);
    if (file != null) setFile(null);
    if (textInputRef && textInputRef.current) {
      textInputRef.current.innerText = "";
    }
  };

  useEffect(() => {
    let url: any;
    if (fileDisplayRef && fileDisplayRef.current && file !== null) {
      if (!file.type.includes("image")) {
        generateVideoThumbnail(file).then((data) => {
          fileDisplayRef!.current!.src = data as string;
        });
      } else {
        url = URL.createObjectURL(file);
        fileDisplayRef.current.src = url;
      }
    }

    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => console.log(input), [input]);

  return (
    <form
      onSubmit={sendMessage}
      style={{ backgroundColor: "#121318" }}
      className=" row-span-1 shadow-lg   h-fit  p-2 w-full flex justify-between items-center   px-2"
    >
      <div className="flex  items-center justify-center ">
        <label
          htmlFor="dropzone-file"
          style={{ color: "#68686E" }}
          className=" flex flex-col items-center justify-center border-2 border-gray-300  border-hidden rounded-lg cursor-pointer "
        >
          <FiPaperclip size={20} />

          <input
            onChange={(e) => {
              if (
                e.target.files &&
                e.target.files[0] &&
                e.target.files[0].size < 1e8
              ) {
                setFile(e.target.files[0]);
              } else alert("file too large");
              e.target.value = "";
            }}
            id="dropzone-file"
            type="file"
            className="hidden"
          />
        </label>
      </div>
      {file === null ? (
        <div className=" px-3 flex-1 flex items-center gap-2">
          <MessageInput
            sendMessage={sendMessage}
            ref={textInputRef}
            input={message}
            setInput={(e: any) => setMessage(e)}
            roomId={props.roomId}
          />
          <div className="relative  ">
            {emojiPicker && (
              <div
                onMouseLeave={() => {
                  console.log("mouse leave");
                  setEmojiPicker(false);
                }}
                style={{ right: "3dvw", bottom: "50px" }}
                className="absolute    z-50"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage(e);
                }}
              >
                <Picker
                  onEmojiSelect={(e: any) => {
                    if (textInputRef && textInputRef.current) {
                      if (textInputRef.current.innerText === "type...")
                        textInputRef.current.innerText = "";

                      textInputRef.current.innerText += e.native;
                    }
                  }}
                />
              </div>
            )}

            <div
              style={{ color: "#68686E" }}
              onClick={() => {
                console.log("mouse enter");

                setEmojiPicker(true);
              }}
            >
              <ImSmile className="text-teal-500" />
            </div>
          </div>
        </div>
      ) : (
        <SelectFileDisplay
          ref={fileDisplayRef}
          setFile={setFile}
          isImage={file.type.includes("image")}
        />
      )}

      <button className="  text-teal-500 mr-2">
        <IoSendSharp size={25} />
      </button>
    </form>
  );
}
