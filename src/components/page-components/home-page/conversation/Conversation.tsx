import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import timeDurationFormatter from "../../../../lib/utils/timeDurationFormatter";
import { API_BASE_URL } from "../../../../service/api";
import { Friend, ProfilePhoto } from "../../../../lib/types/types";
import { tempCatPhoto } from "../../../../assets/temporaryProfilePhoto";
import isFile from "../../../../lib/utils/isFile";
export default function Conversation({
  data,
}: {
  data: Friend & { CurrentUserIsLastMessageSender: boolean };
}) {
  const {
    friendshipId,
    friendName,
    friendId,
    lastMessageCreatedAt,
    isActiveNow,
    profilePhoto,
    unreadMessageCount,
  } = data;

  return (
    <NavLink
      to={"/messages/" + friendshipId + "/" + friendId}
      className={({ isActive }) =>
        isActive ? "conversation-item-active" : "conversation-item"
      }
    >
      <DisplayProfilePhoto
        isActiveNow={isActiveNow}
        profilePhoto={profilePhoto}
      />
      <div className=" hidden md:hidden lg:flex flex-1  justify-between items-center  ">
        <div>
          <h2 className=" font-semibold   ">{friendName}</h2>
          <DisplayLastMessage data={data} />
        </div>
        <div className="  lg:flex flex-col  sm:hidden md:hidden  items-end md:justify-start gap-2">
          <DisplayLastMessageTimestamp
            lastMessageCreatedAt={lastMessageCreatedAt}
          />
          <DisplayUnreadMessageCount unreadMessageCount={unreadMessageCount} />
        </div>
      </div>
    </NavLink>
  );
}

function DisplayLastMessageTimestamp({
  lastMessageCreatedAt,
}: {
  lastMessageCreatedAt: string;
}) {
  const [time, setTime] = useState<string>("");
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
    <p style={{ fontSize: "0.7rem" }} className="  text-slate-500">
      {time}
    </p>
  );
}

function DisplayUnreadMessageCount({
  unreadMessageCount,
}: {
  unreadMessageCount: number;
}) {
  return (
    <>
      {unreadMessageCount !== 0 && (
        <p className=" bg-red-400  text-white rounded-full w-4 h-4 flex justify-center">
          {unreadMessageCount}
        </p>
      )}
    </>
  );
}
function DisplayLastMessage({
  data,
}: {
  data: Friend & { CurrentUserIsLastMessageSender: boolean };
}) {
  const {
    lastMessageSenderId,
    lastMessageType,
    CurrentUserIsLastMessageSender,
    friendId,
    isTheLastMessageDeletedByReceiver,
    lastMessageContent,
  } = data;
  function displayLastMessage() {
    if (!lastMessageContent) return "no conversation yet!";
    let text = CurrentUserIsLastMessageSender === true ? "you: " : "";

    if (
      lastMessageSenderId === friendId &&
      isTheLastMessageDeletedByReceiver === true
    ) {
      text += "deleted message";
      return text;
    }

    if (lastMessageType?.split("/")[0] == "image") {
      text += "sent a photo";
      return text;
    }

    if (lastMessageType?.split("/")[0] == "video") {
      text += "sent a video";
      return text;
    }

    if (isFile(lastMessageType)) {
      text += "sent a file";
      return text;
    }
    if (!lastMessageContent) return "no message yet!";
    if (lastMessageContent.length <= 10) return (text += lastMessageContent);
    else {
      let a = lastMessageContent
        .split("")
        .filter((_: any, index: number) => index <= 10)
        .join("");
      return (text += a);
    }
  }
  return (
    <p
      style={{
        fontSize: "0.8rem",
        color: "#68686E",
      }}
      className=" w-full h-full break-words   "
    >
      {displayLastMessage()}
    </p>
  );
}

function DisplayProfilePhoto({
  isActiveNow,
  profilePhoto,
}: {
  isActiveNow: boolean;
  profilePhoto: ProfilePhoto;
}) {
  return (
    <div className={` w-12 h-12 avatar ${isActiveNow ? "online" : "offline"}`}>
      <img
        className="rounded-full  avatar h-10 w-10 "
        src={
          profilePhoto
            ? `${API_BASE_URL}/resources/profiles/${profilePhoto.path}`
            : tempCatPhoto
        }
      />
    </div>
  );
}
