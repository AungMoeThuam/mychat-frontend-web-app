import { useEffect, useState } from "react";
import Conversation from "./Conversation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFriendsInBackground,
  fetchFriends,
} from "../../../../redux/features/friend/friendThunks";
import { RootState, StoreDispatch } from "../../../../redux/store/store";
import { Friend } from "../../../../utils/constants/types";
import socket from "../../../../service/socket";
import { Event } from "../../../../utils/constants/socketEvents";
import { updateOnlineStatus } from "../../../../redux/features/friend/friendSlice";
import { deleteMessageSuccess } from "../../../../redux/features/message/messageSlice";

export default function ConversationList() {
  const { friendsList, error, loading, message } = useSelector(
    (state: RootState) => state.friendSlice
  );
  const dispatch = useDispatch<StoreDispatch>();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const listener = (data: { userId: string; active: boolean }) =>
      dispatch(updateOnlineStatus(data));

    const OnDeleteMessageListener = (data: {
      messageId: string;
      deleteBySender: boolean;
    }) => dispatch(deleteMessageSuccess(data));

    const onNewMessageListener = () => dispatch(fetchFriendsInBackground());

    dispatch(fetchFriends());

    socket.subscribeOneEvent(Event.NEWACTIVEUSER, listener);
    socket.subscribeOneEvent(Event.NEWOFFLINEUSER, listener);
    socket.subscribeOneEvent(Event.DELETEMESSAGE, OnDeleteMessageListener);
    socket.subscribeOneEvent(Event.NEWMESSAGE, onNewMessageListener);
    socket.subscribeOneEvent(Event.NEWNOTIFICATION, onNewMessageListener);

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
      <div
        style={{
          height: "8%",
          borderRight: "5px solid #0a0a0a",
        }}
        className=" p-2 "
      >
        <input
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="input input-sm input-bordered w-full max-w-xs "
          placeholder="search..."
          type="search"
          name="search"
          id="search"
          value={search}
        />
      </div>
      <div
        style={{ height: "92%" }}
        className=" overflow-y-scroll px-2 py-2 "
        id="conversationList"
      >
        {friendsList.length === 0 ? (
          <h1>no conversation yet!</h1>
        ) : (
          friendsList
            .filter((e) => e.name.includes(search))
            .map((item: Friend) => {
              return (
                <Conversation
                  key={item.roomId}
                  data={{
                    ...item,
                    unreadMessageCount: item.unreadMessageCount
                      ? item.unreadMessageCount
                      : 0,
                    CurrentUserIsLastMessageSender:
                      item.senderId === item.friendId ? false : true, // if the last message senderid is the currentuserId, then true
                  }}
                />
              );
            })
        )}
      </div>
    </>
  );
}
