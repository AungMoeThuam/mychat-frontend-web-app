import ChatInputSection from "../../components/page-components/chat.page/chat-input-section/ChatInputSection";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MessageList from "../../components/page-components/chat.page/MessageList";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../redux/store/store";
import { getMessagesListThunk } from "../../redux/actions/messageThunks";
import socket from "../../services/socket";
import { Event } from "../../utils/socketEvents";
import {
  addMessage,
  updateMessageStatusAction,
} from "../../redux/slices/messageSlice";
import TypingIndicator from "../../components/page-components/chat.page/typing-indicator/TypingIndicator";
import { ProfilePhoto } from "../../utils/types";
import { FriendShipApi } from "../../services/friendshipApi";
import ChatHeader from "../../components/page-components/chat.page/chat-header/ChatHeader";
type FriendInfo = {
  name: string;
  profilePhoto: ProfilePhoto;
};
const elementIsVisibleInViewport = (el: HTMLElement) => {
  if (!el) return "no loaded";
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};
export default function Chat() {
  const { roomId, friendId } = useParams();
  const [isMessageRemaining, setisMessageRemaining] = useState(false);
  const [friendInfo, setFriendInfo] = useState<FriendInfo | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const loadMessageRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<StoreDispatch>();
  const messageSlice = useSelector((state: RootState) => state.messageSlice);

  const loadMoreMessages = async () => {};

  useEffect(() => {
    async function checkFriendShipStatus() {
      try {
        const result = await FriendShipApi.checkFriendShipStatus(
          friendId!,
          roomId!
        );
        if (!result.error) return setFriendInfo(result.data);
      } catch (error: any) {
        alert(error.message);
      }
    }
    checkFriendShipStatus();
  }, []);
  useEffect(() => {
    if (messageSlice.messagesList.length !== 0)
      ref.current?.scrollIntoView({
        behavior: "instant",
      });
    if (elementIsVisibleInViewport(ref.current!) === false)
      ref.current?.scrollIntoView({
        behavior: "instant",
      });
  }, [messageSlice.messagesList]);

  useEffect(() => {
    async function onMessageListner(data: any) {
      console.log(data);

      if (data.roomId === roomId) dispatch(addMessage(data));
    }
    async function onMessageStatusListener(data: any[]) {
      dispatch(updateMessageStatusAction(data));
    }

    socket.emitEvent(Event.JOINROOM, { roomId });
    socket.subscribeOneEvent(Event.MESSAGE, onMessageListner);
    socket.subscribeOneEvent(Event.MESSAGE_STATUS, onMessageStatusListener);

    if (roomId && friendId)
      dispatch(getMessagesListThunk({ roomId, friendId }));

    return () => {
      socket.unbSubcribeOneEvent(Event.MESSAGE, onMessageListner);
      socket.unbSubcribeOneEvent(Event.MESSAGE_STATUS, onMessageStatusListener);
      socket.leaveRoom(roomId!);
    };
  }, [roomId]);

  return (
    <div className="h-full w-full flex flex-col">
      <ChatHeader
        profilePhotoFilePath={friendInfo?.profilePhoto?.path}
        friendName={friendInfo?.name}
      />
      <main
        id="messageBox"
        style={{ backgroundColor: "#18181f" }}
        className="   pt-8 px-5 pb-8 w-full flex-1 overflow-y-scroll "
      >
        {isMessageRemaining && (
          <div
            onClick={loadMoreMessages}
            className="text-center cursor-pointer"
            ref={loadMessageRef}
            key={"##3"}
          >
            Load More
          </div>
        )}
        {messageSlice.messagesList.length === 0 ? (
          <h1>Start a conversation with your friend!</h1>
        ) : (
          <MessageList {...messageSlice} />
        )}
        <TypingIndicator key={"##2"} />
        <div ref={ref} key={"##1"}></div>
      </main>
      {friendInfo ? (
        <ChatInputSection friendId={friendId} roomId={roomId} />
      ) : (
        <div className=" row-span-1 shadow-lg   h-fit  p-2 w-full flex justify-between items-center   px-2">
          <h1>only friend can have conversation!</h1>
        </div>
      )}
    </div>
  );
}
