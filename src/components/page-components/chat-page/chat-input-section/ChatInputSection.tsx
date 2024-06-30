import { FormEvent, useEffect, useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import MessageInput from "../message-input/MessageInput";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../../../redux/store/store";
import { MdKeyboardVoice } from "react-icons/md";
import voiceRecorderService from "../../../../utils/voiceRecorder";

import FilePicker from "./FilePicker";
import SelectedFileDisplayer from "./SelectFileDisplay";
import VoiceRecorder from "./VoiceRecorderDisplay";
import { MessageApi } from "../../../../service/message-api-service";
import toast from "react-hot-toast";
import { addMessage } from "../../../../redux/features/message/messageSlice";
import RecordedAudioDisplayer from "../message/audio-message-display/AudioMessageDisplay";
import generateVideoThumbnail from "../../../../utils/videoThumbnailGenerator";

export default function ChatInput(props: { friendId: any; roomId: any }) {
  const { roomId } = props;
  const [content, setContent] = useState("");
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const { currentUserId } = useSelector((state: RootState) => state.authSlice);
  const [voiceRecorder, setVoiceRecoder] = useState(false);
  const fileDisplayRef = useRef<HTMLImageElement>(null);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const dispatch = useDispatch<StoreDispatch>();
  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    console.log(file);
    if (!content.trim() && !file) return;

    let temporaryMessageId = "-temp" + Math.round(Math.random() * 1000000);
    dispatch(
      addMessage({
        messageId: temporaryMessageId,
        content: file ? file.name : content,
        type: file ? file.type : "text",
        senderId: currentUserId,
        receiverId: props.friendId,
        friendshipId: props.roomId,
        deliveryStatus: 9,
        createdAt: new Date().toLocaleString(),
        isDeletedByReceiver: false,
      })
    );

    let f = file;
    setFile(null);
    const result = await MessageApi.sendMessage({
      temporaryMessageId,
      content: f ? f.name : content,
      type: f ? f.type : "text",
      senderId: currentUserId,
      receiverId: props.friendId,
      friendshipId: props.roomId,
      file: f,
    });
    if (result.error) {
      toast("failed to send!");
    }

    setContent("");
    sessionStorage.removeItem(roomId);
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

    return () => {
      URL.revokeObjectURL(url);
      if (file) setFile(null);
    };
  }, [file, roomId]);

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
              <FilePicker
                roomId={roomId}
                ref={submitBtnRef}
                setFile={setFile}
              />
              <MdKeyboardVoice onClick={recordVoice} size={20} />
              <MessageInput
                content={content}
                setContent={setContent}
                setEmojiPicker={setEmojiPicker}
                emojiPicker={emojiPicker}
                sendMessage={sendMessage}
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

      <button ref={submitBtnRef} type="submit" className="text-lime-500 mr-2">
        <IoSendSharp size={25} />
      </button>
    </form>
  );
}
