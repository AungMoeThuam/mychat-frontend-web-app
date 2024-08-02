import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import MessageList from "../components/page-components/chat-page/MessageList";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../redux/store/store";
import { fetchMessages } from "../redux/features/message/messageThunks";
import socket from "../service/socket.service";
import { Event } from "../lib/utils/socketEvents";
import {
  updateMessageSuccess,
  updateMessageStatusIntoDeliveredAction,
  updateMessageStatusIntoSeenAction,
} from "../redux/features/message/messageSlice";
import TypingIndicator from "../components/page-components/chat-page/typing-indicator/TypingIndicator";
import ChatHeader from "../components/page-components/chat-page/chat-header/ChatHeader";
import { clearUnreadMessageCount } from "../redux/features/friend/friendSlice";
import toast from "react-hot-toast";
import ChatInputSection from "../components/page-components/chat-page/chat-input-section/ChatInputSection";
import useFriendInfo from "../lib/hooks/useFriendInfo";

export default function Chat() {
  const currentUserId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );
  const { roomId, friendId } = useParams();
  const { data: friendInfo } = useFriendInfo({
    currentUserId: currentUserId,
    roomId: roomId!,
  });
  const ref = useRef<HTMLDivElement>(null);
  const loadMessageRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<StoreDispatch>();
  const messageSlice = useSelector((state: RootState) => state.messageSlice);

  const loadMoreMessages = async () => {
    let lastMessageId = messageSlice.messagesList[0].messageId;
    dispatch(
      fetchMessages({ lastMessageId, roomId: roomId!, friendId: friendId! })
    );
  };

  useEffect(() => {
    if (messageSlice.messagesList.length !== 0)
      ref.current?.scrollIntoView({
        behavior: "instant",
      });
  }, [messageSlice.messagesList]);

  useEffect(() => {}, []);
  useEffect(() => {
    socket.emitEvent(Event.JOINROOM, {
      roomId,
      userId: currentUserId,
      friendId,
    });
    const onReadMessage = (data: any) => {
      dispatch(clearUnreadMessageCount(data));
    };

    onReadMessage(roomId);

    async function onMessageListner(data: any) {
      console.log(data);

      if (data.friendshipId === roomId) {
        dispatch(updateMessageSuccess(data));
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
    };

    socket.subscribeOneEvent("error", onError);
    socket.subscribeOneEvent(Event.MESSAGE, onMessageListner);
    socket.subscribeOneEvent(
      Event.MESSAGE_STATUS_SEEN,
      onMessageStatusListener
    );
    socket.subscribeOneEvent(Event.MESSAGE_STATUS_DELIVERED, OnTest);

    if (roomId) dispatch(fetchMessages({ roomId, friendId: friendId! }));

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
  }, [roomId, friendInfo]);

  return (
    <div className="h-full w-full flex flex-col ">
      <ChatHeader
        friendId={friendId}
        profilePhotoFilePath={friendInfo?.profilePhoto?.path}
        friendName={friendInfo?.name}
      />
      <main
        id="messageBox"
        className="   dark:bg-zinc-900 bg-slate-100  pt-8 px-5 pb-8 w-full flex-1 overflow-y-scroll flex flex-col "
      >
        <div
          onClick={loadMoreMessages}
          className="text-center cursor-pointer"
          ref={loadMessageRef}
          key={"##3"}
        >
          Load More
        </div>

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
        <ChatInputSection friendId={friendInfo.friendId} roomId={roomId} />
      ) : (
        <div className=" row-span-1 shadow-lg   h-fit  p-2 w-full flex justify-between items-center   px-2">
          <h1>only friend can have conversation!</h1>
        </div>
      )}
    </div>
  );
}
