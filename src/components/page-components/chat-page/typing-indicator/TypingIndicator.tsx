import { useEffect, useState } from "react";
import socket from "../../../../service/socket.service";
import { Event } from "../../../../lib/utils/socketEvents";

export default function TypingIndicator() {
  const [typingIndicator, setTypingIndicator] = useState(false);
  useEffect(() => {
    const startTypingHandler = () => setTypingIndicator(true);
    const stopTypingHandler = () => setTypingIndicator(false);

    socket.subscribeOneEvent(Event.STARTTYPING, startTypingHandler);
    socket.subscribeOneEvent(Event.STOPTYPING, stopTypingHandler);
    return () => {
      socket.unbSubcribeOneEvent(Event.STARTTYPING, startTypingHandler);
      socket.unbSubcribeOneEvent(Event.STOPTYPING, stopTypingHandler);
    };
  });
  return (
    <div className=" text-slate-700 text-sm">
      {typingIndicator && "typing..."}
    </div>
  );
}
