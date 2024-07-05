import { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";

import { backendUrlWihoutApiEndpoint } from "../../../../utils/backendConfig";
import timeDurationFormatter from "../../../../utils/timeDurationFormatter";
import { Friend } from "../../../../lib/models/models";
const tempPhoto =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
export default function Conversation({
  data,
}: {
  data: Friend & { CurrentUserIsLastMessageSender: boolean };
}) {
  const [time, setTime] = useState<string>("");
  const {
    friendshipId,
    lastMessageSenderId,
    friendName,
    friendId,
    lastMessageCreatedAt,
    isActiveNow,
    lastMessageContent,
    CurrentUserIsLastMessageSender,
    lastMessageType,
    isTheLastMessageDeletedByReceiver,
    profilePhoto,
    unreadMessagesCount,
  } = data;

  function displayMessage() {
    if (lastMessageType === undefined) return "no conversation yet!";
    let text = CurrentUserIsLastMessageSender === true ? "you: " : "";

    if (
      lastMessageSenderId === friendId &&
      isTheLastMessageDeletedByReceiver === true
    ) {
      text += "deleted message";
      return text;
    }

    if (lastMessageType?.split("/")[0] == "image" && "sent a photo") {
      text += "sent a photo";
      return text;
    }

    if (lastMessageType?.split("/")[0] == "video" && "sent a video") {
      text += "sent a video";
      return text;
    }

    if (
      lastMessageType?.split("/")[0] !== "image" &&
      lastMessageType?.split("/")[0] !== "video" &&
      lastMessageType !== "text" &&
      "sent a file"
    ) {
      text += "sent a file";
      return text;
    }
    if (lastMessageContent === undefined) return "no message yet!";
    if (lastMessageContent.length <= 10) return (text += lastMessageContent);
    else {
      let a = lastMessageContent
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
    if (!lastMessageCreatedAt) return;
    setTime(timeDurationFormatter(new Date(lastMessageCreatedAt).getTime()));
    let id = setInterval(() => {
      setTime((prev: string) => {
        prev = timeDurationFormatter(new Date(lastMessageCreatedAt).getTime());
        return prev;
      });
    }, 60000);

    return () => clearInterval(id);
  }, [lastMessageCreatedAt, time]);

  return (
    <NavLink
      to={"/messages/" + friendshipId + "/" + friendId}
      id="f"
      // style={{ backgroundColor: "#FF2CDF" }}
      className={({ isActive }) =>
        isActive
          ? " flex px-2 items-center h-16  cursor-pointer  gap-3 mb-2  text-lime-500  bg-zinc-800 hover:text-lime-500 hover:bg-zinc-800"
          : " flex px-2 items-center h-16  cursor-pointer  gap-3 mb-2  text-zinc-900 dark:text-lime-500  hover:bg-zinc-900  hover:text-lime-500"
      }
    >
      <div
        className={` w-12 h-12 avatar ${isActiveNow ? "online" : "offline"}`}
      >
        <img
          className="rounded-full  avatar h-10 w-10 "
          src={
            profilePhoto
              ? `${backendUrlWihoutApiEndpoint}/resources/profiles/${profilePhoto.path}`
              : tempPhoto
          }
        />
      </div>

      <div className=" hidden md:hidden lg:flex flex-1  justify-between items-center  ">
        <div>
          <h2 className=" font-semibold   ">{friendName}</h2>
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
          {unreadMessagesCount !== 0 && !CurrentUserIsLastMessageSender && (
            <p
              style={{ fontSize: "0.7rem" }}
              className=" bg-red-400 rounded-full w-4 h-4 flex justify-center"
            >
              {unreadMessagesCount}
            </p>
          )}
        </div>
      </div>
    </NavLink>
  );
}
