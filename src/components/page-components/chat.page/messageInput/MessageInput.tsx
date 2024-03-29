import {
  ChangeEvent,
  Dispatch,
  FocusEventHandler,
  FormEvent,
  ForwardedRef,
  KeyboardEvent,
  PropsWithChildren,
  SetStateAction,
  forwardRef,
  useEffect,
  useState,
} from "react";
import "./style.css";
import socket from "../../../../services/socket";
import { Event } from "../../../../utils/socketEvents";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { ImSmile } from "react-icons/im";
import Picker from "@emoji-mart/react";

const MessageInput = forwardRef<
  HTMLTextAreaElement | null,
  PropsWithChildren<{
    roomId: any;
    emojiPicker: boolean;
    setEmojiPicker: Dispatch<SetStateAction<boolean>>;
    sendMessage: (e: FormEvent) => Promise<void>;
  }>
>(function (props, ref: ForwardedRef<HTMLTextAreaElement>) {
  const { roomId, sendMessage, emojiPicker, setEmojiPicker } = props;
  const [content, setContent] = useState("");
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
    window.addEventListener("beforeunload", () => {
      sessionStorage.removeItem(roomId);
    });

    return () => {
      setContent("");
      window.removeEventListener("beforeunload", () => {
        sessionStorage.removeItem(roomId);
      });
    };
  }, [roomId]);

  return (
    <>
      <textarea
        ref={ref}
        rows={1}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onInput={handleInput}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="type here..."
        className="textarea  w-full"
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
          <ImSmile className="text-teal-500" />
        </div>
      </div>
    </>
  );
});

MessageInput.displayName = "MessageInput";
export default MessageInput;
