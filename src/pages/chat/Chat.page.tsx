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
  updateMessage,
  updateMessageStatusIntoDeliveredAction,
  updateMessageStatusIntoSeenAction,
} from "../../redux/slices/messageSlice";
import TypingIndicator from "../../components/page-components/chat.page/typing-indicator/TypingIndicator";
import ChatHeader from "../../components/page-components/chat.page/chat-header/ChatHeader";
import { clearUnReadMessageCount } from "../../redux/slices/friendSlice";
import useFriendInfo from "../../hooks/useFriendInfo";
import toast from "react-hot-toast";

export default function Chat() {
  const currentUserId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );
  const { roomId, friendId } = useParams();
  const [isMessageRemaining, setisMessageRemaining] = useState(false);
  const { data: friendInfo } = useFriendInfo({
    friendId: friendId!,
    currentUserId: currentUserId,
    roomId: roomId!,
  });
  const ref = useRef<HTMLDivElement>(null);
  const loadMessageRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<StoreDispatch>();
  const messageSlice = useSelector((state: RootState) => state.messageSlice);

  const loadMoreMessages = async () => {};

  useEffect(() => {
    if (messageSlice.messagesList.length !== 0)
      ref.current?.scrollIntoView({
        behavior: "instant",
      });
  }, [messageSlice.messagesList]);

  useEffect(() => {
    const onReadMessage = (data: any) => {
      dispatch(clearUnReadMessageCount(data));
    };

    onReadMessage(roomId);

    async function onMessageListner(data: any) {
      if (data.roomId === roomId) {
        dispatch(updateMessage(data));
      }
    }
    async function onMessageStatusListener() {
      dispatch(updateMessageStatusIntoSeenAction());
    }
    async function OnTest(data: { friendId: string }) {
      const { friendId: fId } = data;
      if (fId === friendId && roomId)
        dispatch(updateMessageStatusIntoDeliveredAction());
    }
    const onError = (data: any) => {
      toast(data.message);
      console.log("on error ", data);
    };

    socket.emitEvent(Event.JOINROOM, {
      roomId,
      userId: currentUserId,
      friendId,
    });

    socket.subscribeOneEvent("error", onError);
    socket.subscribeOneEvent(Event.MESSAGE, onMessageListner);
    socket.subscribeOneEvent(
      Event.MESSAGE_STATUS_SEEN,
      onMessageStatusListener
    );
    socket.subscribeOneEvent(Event.MESSAGE_STATUS_DELIVERED, OnTest);

    if (roomId && friendId)
      dispatch(getMessagesListThunk({ roomId, friendId }));

    return () => {
      socket.unbSubcribeOneEvent("error", onError);
      socket.unbSubcribeOneEvent(Event.MESSAGE, onMessageListner);
      socket.unbSubcribeOneEvent(
        Event.MESSAGE_STATUS_SEEN,
        onMessageStatusListener
      );
      socket.unbSubcribeOneEvent(Event.MESSAGE_STATUS_DELIVERED, OnTest);
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
        className="   pt-8 px-5 pb-8 w-full flex-1 overflow-y-scroll flex flex-col "
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
        {messageSlice.error ? (
          <h1>{messageSlice.message}</h1>
        ) : messageSlice.messagesList.length === 0 ? (
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
