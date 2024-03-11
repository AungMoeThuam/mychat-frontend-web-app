import { AiFillPhone } from "react-icons/ai";
import { HiDotsVertical } from "react-icons/hi";
import ChatInputSection from "./chatinputsection/ChatInputSection";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import MessageList from "./MessageList";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../redux/store/store";
import { getMessagesListThunk } from "../../redux/actions/messageThunks";
import socket from "../../services/socket";
import { Event } from "../../utils/socketEvents";
import { addMessage, deleteMessage } from "../../redux/slices/messageSlice";
import { backgroundColor1, borderColor } from "../../utils/style";
import {
  backendUrl,
  backendUrlWihoutApiEndpoint,
} from "../../utils/backendConfig";
import { tempCatPhoto } from "../../utils/helper";
import TypingIndicator from "./typing-indicator/TypingIndicator";

export default function Chat() {
  const { roomId, friendId } = useParams();
  const [isFriend, setIsFriend] = useState(false);
  const [params] = useSearchParams();
  const { friendName, profilePhoto } = useLocation().state;
  const [lastMessageIdForLoadMessage, setLastMessageIdForLoadMessage] =
    useState("");
  const ref = useRef<HTMLDivElement>(null);
  const loadMessageRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<StoreDispatch>();
  const messageSlice = useSelector((state: RootState) => state.messageSlice);

  const loadMoreMessages = async () => {};
  useEffect(() => {
    async function checkFriendShipStatus() {
      try {
        const res = await fetch(`${backendUrl}/friends/check/friend/${roomId}`);
        const result = await res.json();
        if (result.status !== "success") {
          setIsFriend(false);
        } else {
          setIsFriend(true);
        }
      } catch (error: any) {
        alert(error.message);
      }
    }
    checkFriendShipStatus();
  }, []);
  useEffect(() => {
    setTimeout(() =>
      ref.current?.scrollIntoView({
        behavior: "instant",
      })
    );
  }, [messageSlice.messagesList]);

  useEffect(() => {
    async function onMessageListner(data: any) {
      setLastMessageIdForLoadMessage(data.messageId);
      dispatch(addMessage(data));
    }
    async function onDeleteMessageListener(data: any) {
      dispatch(deleteMessage(data));
    }
    socket.emitEvent(Event.JOINROOM, { roomId });
    socket.subscribeOneEvent(Event.MESSAGE, onMessageListner);
    socket.subscribeOneEvent(Event.DELETEMESSAGE, onDeleteMessageListener);

    if (roomId) dispatch(getMessagesListThunk(roomId));

    return () => {
      socket.unbSubcribeOneEvent(Event.MESSAGE, onMessageListner);
      socket.unbSubcribeOneEvent(Event.DELETEMESSAGE, onDeleteMessageListener);
    };
  }, [roomId]);
  console.log("friendId testing ", params.get("rid"));
  return (
    <div className="  h-full   w-full flex flex-col ">
      <header
        style={{ backgroundColor: backgroundColor1, borderColor: borderColor }}
        className="  shadow-lg text-white    h-20 px-4 py-2 border-b   w-full flex justify-between items-center gap-2"
      >
        <div className="flex justify-center items-center">
          <img
            className=" w-16 h-16 bg-slate-300 avatar rounded-full shadow mr-2"
            src={
              profilePhoto
                ? `${backendUrlWihoutApiEndpoint}/resources/profiles/${profilePhoto.path}`
                : tempCatPhoto
            }
            alt="profile"
          />
          <div className="flex flex-col text-lg font-bold">
            {friendName}
            <span className=" text-sm font-normal">1 minute ago</span>
          </div>
        </div>
        <ul
          style={{ color: "#68686e" }}
          className="flex gap-4 items-center pr-4 "
        >
          <li onClick={() => alert("this feature is not available yet!")}>
            <AiFillPhone className=" text-teal-500" size={25} />
          </li>
          <li className=" ">
            <HiDotsVertical className="text-teal-500" size={25} />
          </li>
        </ul>
      </header>
      <main
        id="messageBox"
        style={{ backgroundColor: "#18181f" }}
        className="   pt-8 px-5 pb-8 w-full flex-1 overflow-y-scroll "
      >
        <div
          onClick={loadMoreMessages}
          className="text-center cursor-pointer"
          ref={loadMessageRef}
          key={"##2"}
        >
          Load More
        </div>
        {messageSlice.messagesList.length === 0 ? (
          <h1>Start a conversation with your friend!</h1>
        ) : (
          <MessageList {...messageSlice} />
        )}
        <TypingIndicator key={"##2"} />
        <div ref={ref} key={"###1"}></div>
      </main>
      {isFriend ? (
        <ChatInputSection friendId={friendId} roomId={roomId} />
      ) : (
        <div className=" row-span-1 shadow-lg   h-fit  p-2 w-full flex justify-between items-center   px-2">
          <h1>only friend can have conversation!</h1>
        </div>
      )}
    </div>
  );
}
