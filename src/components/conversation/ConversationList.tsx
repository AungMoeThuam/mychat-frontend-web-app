import { useEffect } from "react";
import Conversation from "./Conversation";
import { useDispatch, useSelector } from "react-redux";
import { getFriendsListThunk } from "../../redux/thunks/friendThunks";
import { RootState, StoreDispatch } from "../../redux/store/store";
import { Friend, Message } from "../../utils/types";
import socket from "../../services/socket";
import { Event } from "../../utils/contants";
import {
  addNewMessage,
  updateOnlineFriendStatus,
} from "../../redux/slice/friendSlice";
import { deleteMessage } from "../../redux/slice/messageSlice";

export default function ConversationList() {
  const { friendsList, error, loading, message } = useSelector(
    (state: RootState) => state.friendSlice
  );
  const dispatch = useDispatch<StoreDispatch>();
  useEffect(() => {
    function listener(data: { userId: string; active: boolean }) {
      dispatch(updateOnlineFriendStatus(data));
    }

    function onNewMessageListener(data: Message) {
      dispatch(addNewMessage(data));
    }
    function OnDeleteMessageListener(data: {
      messageId: string;
      deleteBySender: boolean;
    }) {
      dispatch(deleteMessage(data));
    }
    dispatch(getFriendsListThunk());

    socket.subscribeOneEvent(Event.NEWACTIVEUSER, listener);
    socket.subscribeOneEvent(Event.NEWOFFLINEUSER, listener);
    socket.subscribeOneEvent(Event.NEWMESSAGE, onNewMessageListener);
    socket.subscribeOneEvent(Event.NEWNOTIFICATION, onNewMessageListener);
    socket.subscribeOneEvent(Event.DELETEMESSAGE, OnDeleteMessageListener);

    return () => {
      socket.unbSubcribeOneEvent(Event.NEWACTIVEUSER, listener);
      socket.unbSubcribeOneEvent(Event.NEWOFFLINEUSER, listener);
      socket.unbSubcribeOneEvent(Event.NEWMESSAGE, onNewMessageListener);
      socket.unbSubcribeOneEvent(Event.NEWNOTIFICATION, onNewMessageListener);
      socket.unbSubcribeOneEvent(Event.DELETEMESSAGE, OnDeleteMessageListener);
    };
  }, []);
  if (error) return <h1>{message}</h1>;
  if (loading) return <h1>...loading</h1>;

  return (
    <>
      {friendsList.length === 0 ? (
        <h1>no conversation yet!</h1>
      ) : (
        friendsList.map((item: Friend) => {
          return (
            <Conversation
              key={item.roomId}
              data={{
                ...item,
                CurrentUserIsLastMessageSender:
                  item.senderId === item.friendId ? false : true, // if the last message senderid is the currentuserId, then true
              }}
            />
          );
        })
      )}
    </>
  );
}
