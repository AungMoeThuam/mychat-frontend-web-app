import { useEffect, useState } from "react";
import getTimeDuration from "../../utils/time";
import { Link } from "react-router-dom";
import { Friend } from "../../utils/types";

export default function Conversation({
  data,
}: {
  data: Friend & { CurrentUserIsLastMessageSender: boolean };
}) {
  const [time, setTime] = useState<string>("");
  const {
    roomId,
    senderId,
    name,
    friendId,
    messageCreatedAt,
    active,
    content,
    CurrentUserIsLastMessageSender,
    type,
    deletedByReceiver,
  } = data;

  function displayMessage() {
    let text = CurrentUserIsLastMessageSender === true ? "you: " : "";

    if (senderId === friendId && deletedByReceiver === true) {
      text += "deleted message";
      return text;
    }

    if (type == "image" && "sent a photo") {
      text += "sent a photo";
      return text;
    }

    if (type == "video" && "sent a video") {
      text += "sent a video";
      return text;
    }

    if (type == "file" && "sent a file") {
      text += "sent a video";
      return text;
    }
    if (content === undefined) return "no message yet!";
    if (content.length <= 10) return (text += content);
    else {
      let a = content
        .split("")
        .filter((_: any, index: number) => index <= 10)
        .join("");
      return (text += a);
    }
  }

  useEffect(() => {
    console.log("components render!");
  });

  useEffect(() => {
    if (!messageCreatedAt) return;
    setTime(getTimeDuration(new Date(messageCreatedAt).getTime()));
    let id = setInterval(() => {
      setTime((prev: string) => {
        prev = getTimeDuration(new Date(messageCreatedAt).getTime());
        return prev;
      });
    }, 60000);

    return () => clearInterval(id);
  }, [messageCreatedAt, time]);

  return (
    <Link
      to={"/messages/" + roomId}
      state={{ friendId, friendName: name }}
      id="f"
      className={`${
        false ? " bg-slate-800" : ""
      } flex items-center h-16 rounded-md cursor-pointer  gap-3 mb-2  text-white hover:bg-teal-950`}
    >
      <div className={` w-12 h-12 avatar ${active ? "online" : "offline"}`}>
        <img
          className="rounded-full  w-full    "
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
      </div>

      <div className=" hidden md:hidden lg:flex flex-1  justify-between items-center  ">
        <div>
          <h2 className=" font-semibold">{name}</h2>
          <p
            style={{
              fontSize: "0.8rem",
              color: "#68686E",
            }}
            className=" w-full h-full break-words   "
          >
            {displayMessage()}
          </p>
        </div>
        <div className="  lg:flex flex-col  sm:hidden md:hidden  items-end md:justify-start gap-2">
          <p style={{ fontSize: "0.7rem" }} className="  text-slate-500">
            {time}
          </p>
          <p
            style={{ fontSize: "0.7rem" }}
            className=" bg-red-400 rounded-full w-4 h-4 flex justify-center"
          >
            4
          </p>
        </div>
      </div>
    </Link>
  );
}
