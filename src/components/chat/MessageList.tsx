import { useSelector } from "react-redux";
import { Message } from "../../utils/types";
import MessageCard from "./message/Message";
import { RootState } from "../../redux/store/store";
import { ForwardedRef, forwardRef, useEffect } from "react";

type MessageListProps = {
  error: boolean;
  success: boolean;
  message: string;
  messagesList: Message[];
  loading: boolean;
};

function MessageList(props: MessageListProps) {
  const { error, message, messagesList, loading, success } = props;
  const { currentUserId } = useSelector((state: RootState) => state.authSlice);

  if (loading) return <h1>{message}</h1>;
  if (error) return <h1>{message}</h1>;
  if (success)
    return (
      <>
        {messagesList
          .filter((item: Message) => {
            if (item.receiverId === currentUserId) {
              /*
              if the current user is the receiver of that message and it is deleted by him,
              then exclude that message
              */
              return item.deletedByReceiver !== true;
            } else {
              // otherwises display the message
              return true;
            }
          })
          .map((item: Message, index: number) => {
            return (
              <MessageCard
                key={item.messageId}
                message={{
                  friendId:
                    item.senderId === currentUserId
                      ? item.receiverId
                      : item.senderId,
                  messageId: item.messageId,
                  currentUserIsSender: item.senderId === currentUserId,
                  content: item.content,
                  type: item.type,
                  onViewImage: () => alert("onviewimage"),
                }}
              />
            );
          })}
      </>
    );
}

export default MessageList;
