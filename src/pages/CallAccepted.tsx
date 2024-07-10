import { useEffect, useState } from "react";
import socket from "../service/socket";
import { useParams } from "react-router-dom";

export default function CallAcceptedPage() {
  const { friendId } = useParams();
  const [text, settext] = useState("");
  useEffect(() => {
    console.log("hello world ", friendId);

    socket.emitEvent("accepting-videocall", { friendId });

    return () => {};
  }, []);

  return (
    <div>
      VideoCallPage {friendId} - {text}
    </div>
  );
}
