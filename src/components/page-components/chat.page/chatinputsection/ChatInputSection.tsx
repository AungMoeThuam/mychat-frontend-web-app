import { FormEvent, useEffect, useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { Event } from "../../../../utils/socketEvents";
import MessageInput from "../messageInput/MessageInput";
import "./style.css";
import generateVideoThumbnail from "../../../../utils/generateThumbnail";
import SelectFileDisplay from "./SelectFileDisplay";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import socket from "../../../../services/socket";
import { backendUrl } from "../../../../utils/backendConfig";
import containsNonISO8859Characters from "../../../../utils/containsNonISO8859Characters";
import { MdKeyboardVoice } from "react-icons/md";
import voiceRecorderService from "../../../../services/voiceRecorderService";
import AudioMessageDisplay from "../message/audio-message-display/AudioMessageDisplay";
import { BsTrashFill } from "react-icons/bs";

import VoiceRecorderDipslay from "./VoiceRecorderDisplay";
import FilePicker from "./FilePicker";

type Message = {
  content: any;
  senderId: any;
  receiverId: string;
  // type: "image" | "video" | "text" | "others";
  type: string;
  roomId: string;
  createdAt: Number;
};

export default function ChatInput(props: { friendId: any; roomId: any }) {
  const [file, setFile] = useState<File | null>(null);
  const { currentUserId } = useSelector((state: RootState) => state.authSlice);
  const [voiceRecorder, setVoiceRecoder] = useState(false);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const fileDisplayRef = useRef<HTMLImageElement>(null);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const sendMessage = async (e: FormEvent) => {
    console.log(textInputRef.current?.value);
    e.preventDefault();
    if (textInputRef?.current?.value.trim() == "") return;
    let messageToSend: Message;
    if (file != null) {
      messageToSend = {
        content: file.name,
        type: file.type,
        senderId: currentUserId,
        receiverId: props.friendId,
        roomId: props.roomId,
        createdAt: Date.now(),
      };
    } else {
      messageToSend = {
        content: textInputRef?.current?.value.toString(),
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

      await Promise.all([res]).then(() => {
        messageToSend.content = filename;
      });
      console.log(messageToSend);
      socket.emitEvent(Event.MESSAGE, messageToSend);
      if (file != null) setFile(null);
      if (textInputRef && textInputRef.current) {
        textInputRef.current.innerText = "";
      }
      return;
    }
    console.log(messageToSend);
    socket.emitEvent(Event.MESSAGE, messageToSend);
    // props.onSendMessage(messageToSend, file);
    if (file != null) setFile(null);
    if (textInputRef && textInputRef.current) {
      textInputRef.current.innerText = "";
    }
  };

  useEffect(() => {
    let url: any;

    console.log(file);

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

  const recordVoice = async () => {
    if (file) setFile(null);
    setVoiceRecoder(true);

    voiceRecorderService.start();
  };
  const stopRecording = () => {
    voiceRecorderService.stop().then((value: Blob) => {
      setVoiceRecoder(false);
      const rawFile = new FileReader();
      rawFile.onload = () => {
        console.log(value);
        //If this is the first audio playing, create a source element
        const f = new File(
          [value],
          Math.round(Math.random() * 1e9) + "audio.webm",
          {
            type: value.type,
          }
        );

        setFile(f);
      };
      rawFile.readAsDataURL(value);
    });
  };

  return (
    <form
      onSubmit={sendMessage}
      style={{ backgroundColor: "#121318" }}
      className=" row-span-1 shadow-lg   h-fit  p-2 w-full flex justify-between items-center   px-2"
    >
      <div className="flex-1 flex justify-center">
        {file === null ? (
          voiceRecorder ? (
            <VoiceRecorderDipslay
              stopRecording={stopRecording}
              removeFile={() => {
                voiceRecorderService.cancel();
                setVoiceRecoder(false);
              }}
            />
          ) : (
            <div className=" px-3 flex-1 flex items-center gap-2">
              <FilePicker setFile={setFile} />
              <MdKeyboardVoice onClick={recordVoice} size={20} />
              <MessageInput
                setEmojiPicker={setEmojiPicker}
                emojiPicker={emojiPicker}
                sendMessage={sendMessage}
                ref={textInputRef}
                roomId={props.roomId}
              />
            </div>
          )
        ) : file.type.split("/")[0] === "audio" ? (
          <div className="flex items-center rounded-md bg-teal-950 px-5">
            <BsTrashFill
              className="text-red-500  cursor-pointer"
              size={20}
              onClick={() => setFile(null)}
            />
            <AudioMessageDisplay
              content={URL.createObjectURL(file)}
              flag={true}
            />
          </div>
        ) : (
          <SelectFileDisplay
            ref={fileDisplayRef}
            setFile={setFile}
            isImage={file.type.includes("image")}
          />
        )}
      </div>

      <button className="  text-teal-500 mr-2">
        <IoSendSharp size={25} />
      </button>
    </form>
  );
}
