import {
  FocusEvent,
  FocusEventHandler,
  FormEvent,
  ForwardedRef,
  PropsWithChildren,
  forwardRef,
  useEffect,
  useState,
} from "react";
import "./style.css";
import socket from "../../../services/socket";
import { Event } from "../../../utils/socketEvents";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";

const MessageInput = forwardRef<
  HTMLParagraphElement | null,
  PropsWithChildren<{
    roomId: any;
    input: any;
    sendMessage: (e: any) => void;
    setInput: (e: any) => void;
  }>
>(function (props, ref: ForwardedRef<HTMLParagraphElement>) {
  const { roomId, input, setInput, sendMessage } = props;
  const [content, setContent] = useState("type...");
  const placeholder = "type...";
  const { friendId } = useParams();
  const currentUserId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );

  const handleFocus: FocusEventHandler<HTMLParagraphElement> = (
    e: FocusEvent<HTMLParagraphElement>
  ) => {
    console.log("start typing!");
    socket.emitEvent(Event.STARTTYPING, { friendId, userId: currentUserId });

    // if (content === placeholder) {
    if (e.currentTarget.innerText === placeholder) {
      // setContent("");
      e.currentTarget.innerText = "";
    }
  };
  const handleBlur = (e: any) => {
    socket.emitEvent(Event.STOPTYPING, { friendId, userId: currentUserId });
    console.log("stop typing!", friendId);
    if (e.currentTarget.innerText.trim() === "") {
      e.currentTarget.innerText = placeholder;
    }
    // setInput(input);
  };
  const onInput = (e: FormEvent<HTMLParagraphElement>) => {
    console.log("typing...");
    sessionStorage.setItem(roomId, e.currentTarget.innerText);
  };
  useEffect(() => {
    // Load content from sessionStorage for this tab
    const savedContent = sessionStorage.getItem(roomId);
    if (savedContent) {
      setContent(savedContent);
      // ref.current.innerText = savedContent;
    }

    // Cleanup: Remove data when the tab is closed
    window.addEventListener("beforeunload", () => {
      sessionStorage.removeItem(roomId);
    });

    return () => {
      window.removeEventListener("beforeunload", () => {
        sessionStorage.removeItem(roomId);
      });
    };
  }, [roomId]);
  return (
    <p
      id="input"
      style={{
        scrollbarColor: " ",
      }}
      suppressContentEditableWarning={true}
      ref={ref}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onInput={onInput}
      data-placeholder="type ..."
      onKeyDown={(e) => {
        if (e.key === "Enter") sendMessage(e);
      }}
      className=" h-fit max-h-24  break-words w-full text-slate-500 outline-none rounded-md  my-2 text-sm   overflow-y-scroll"
      contentEditable
      onPaste={(e) => {
        e.preventDefault();
        let text = e.clipboardData.getData("text/plain");
        e.currentTarget.innerText += text;
        let range = document.createRange();
        range.selectNodeContents(e.currentTarget);
        range.collapse(false); // collapse range to the end
        let selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }}
    >
      {content}
    </p>
  );
});

MessageInput.displayName = "MessageInput";
export default MessageInput;
