import {
  ChangeEvent,
  Dispatch,
  FocusEventHandler,
  FormEvent,
  KeyboardEvent,
  SetStateAction,
  useEffect,
} from "react";
import "./style.css";
import socket from "../../../../service/socket";
import { Event } from "../../../../utils/constants/socketEvents";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { ImSmile } from "react-icons/im";
import Picker from "@emoji-mart/react";
type MessageInputProps = {
  roomId: any;
  emojiPicker: boolean;
  setEmojiPicker: Dispatch<SetStateAction<boolean>>;
  sendMessage: (e: FormEvent) => Promise<void>;
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
};
export default function MessageInput(props: MessageInputProps) {
  const {
    roomId,
    sendMessage,
    emojiPicker,
    setEmojiPicker,
    content,
    setContent,
  } = props;

  const { friendId } = useParams();
  const currentUserId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );

  const handleFocus: FocusEventHandler<HTMLTextAreaElement> = () => {
    console.log("start typing!");
    socket.emitEvent(Event.STARTTYPING, { friendId, userId: currentUserId });
  };

  const handleBlur = () => {
    socket.emitEvent(Event.STOPTYPING, { friendId, userId: currentUserId });
    console.log("stop typing!", friendId);
  };

  const handleInput = (e: FormEvent<HTMLTextAreaElement>) => {
    let rows = e.currentTarget.value.split("\n").length;
    if (rows > 5) return;
    if (rows > 2) {
      e.currentTarget.rows += 1;
    } else {
      e.currentTarget.rows = 1;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    sessionStorage.setItem(roomId, e.currentTarget.value);
    let rows = e.currentTarget.value.split("\n").length;
    if (rows > 3) e.currentTarget.rows = 5;
    setContent(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      sendMessage(e);
      setContent("");
    }
  };

  useEffect(() => {
    // Load content from sessionStorage for this tab
    const savedContent = sessionStorage.getItem(roomId);
    if (savedContent) {
      setContent(savedContent);
    }

    // Cleanup: Remove data when the tab is closed
    const a = () => {
      sessionStorage.removeItem(roomId);
    };
    window.addEventListener("beforeunload", a);

    return () => {
      setContent("");
      window.removeEventListener("beforeunload", a);
    };
  }, [roomId]);

  return (
    <>
      <textarea
        rows={1}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onInput={handleInput}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="type here..."
        className="textarea  w-full bg-slate-200 text-zinc-900 dark:bg-zinc-800 dark:text-white"
        value={content}
      />

      <div className="relative">
        {emojiPicker && (
          <div
            onMouseLeave={() => setEmojiPicker(false)}
            style={{ right: "3dvw", bottom: "50px" }}
            className="absolute z-50"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage(e);
            }}
          >
            <Picker
              onEmojiSelect={(e: any) => setContent((p) => p + e.native)}
            />
          </div>
        )}

        <div style={{ color: "#68686E" }} onClick={() => setEmojiPicker(true)}>
          <ImSmile className="dark:text-lime-500 text-zinc-900" />
        </div>
      </div>
    </>
  );
}
