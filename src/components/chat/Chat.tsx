import { AiFillPhone } from "react-icons/ai";
import { HiDotsVertical } from "react-icons/hi";
import ChatInputSection from "./chatinputsection/ChatInputSection";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import MessageList from "./MessageList";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../redux/store/store";
import { getMessagesListThunk } from "../../redux/thunks/messageThunks";
import socket from "../../services/socket";
import { Event } from "../../utils/contants";
import { addMessage } from "../../redux/slice/messageSlice";
import { backgroundColor1, borderColor } from "../../utils/style";
import { backendUrlWihoutApiEndpoint } from "../../utils/backendConfig";
import { tempCatPhoto } from "../../utils/helper";

export default function Chat() {
  const { roomId } = useParams();
  const { friendId, friendName, profilePhoto } = useLocation().state;
  const [lastMessageIdForLoadMessage, setLastMessageIdForLoadMessage] =
    useState("");
  const ref = useRef<HTMLDivElement>(null);
  const loadMessageRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<StoreDispatch>();
  const messageSlice = useSelector((state: RootState) => state.messageSlice);
  const loadMoreMessages = async () => {};
  useEffect(() => {
    setTimeout(() =>
      ref.current?.scrollIntoView({
        behavior: "instant",
      })
    );
    console.log(lastMessageIdForLoadMessage);
  }, [messageSlice.messagesList]);

  console.log(
    "last message ",
    messageSlice.messagesList[0]?.content,
    " id - ",
    messageSlice.messagesList[0]?.messageId
  );
  useEffect(() => {
    async function onMessageListner(data: any) {
      // setTimeout(
      //   () =>
      //     ref.current?.scrollIntoView({
      //       behavior: "instant",
      //     }),
      //   800
      // );
      setLastMessageIdForLoadMessage(data.messageId);
      dispatch(addMessage(data));
    }
    socket.emitEvent(Event.JOINROOM, { roomId });
    socket.subscribeOneEvent(Event.MESSAGE, onMessageListner);

    if (roomId) dispatch(getMessagesListThunk(roomId));

    return () => {
      socket.unbSubcribeOneEvent(Event.MESSAGE, onMessageListner);
    };
  }, [roomId]);
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
        <div ref={ref} key={"###1"}></div>
      </main>
      <ChatInputSection friendId={friendId} roomId={roomId} onSendMessage="1" />
    </div>
  );
}
