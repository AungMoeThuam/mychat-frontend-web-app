import { FormEvent, useEffect, useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import MessageInput from "../messageInput/MessageInput";
import "./style.css";
import generateVideoThumbnail from "../../../../utils/generateThumbnail";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { MdKeyboardVoice } from "react-icons/md";
import voiceRecorderService from "../../../../services/voiceRecorderService";
import RecordedAudioDisplayer from "../message/audio-message-display/AudioMessageDisplay";
import FilePicker from "./FilePicker";
import SelectedFileDisplayer from "./SelectFileDisplay";
import VoiceRecorder from "./VoiceRecorderDisplay";
import { MessageApi } from "../../../../services/messageApi";

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
    e.preventDefault();
    if (textInputRef?.current?.value.trim() == "") return;
    const result = await MessageApi.sendMessage({
      content: file ? file.name : textInputRef.current!.value,
      type: file ? file.type : "text",
      senderId: currentUserId,
      receiverId: props.friendId,
      roomId: props.roomId,
      createdAt: Date.now(),
      file: file,
    });
    console.log("result ", result);
    if (file != null) setFile(null);
  };

  useEffect(() => {
    let url: string;

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
            <VoiceRecorder
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
        ) : file.type.includes("audio") ? (
          <RecordedAudioDisplayer
            setFile={setFile}
            content={URL.createObjectURL(file)}
            flag={true}
          />
        ) : (
          <SelectedFileDisplayer
            ref={fileDisplayRef}
            setFile={setFile}
            isImage={file.type.includes("image")}
          />
        )}
      </div>

      <button className="text-teal-500 mr-2">
        <IoSendSharp size={25} />
      </button>
    </form>
  );
}
