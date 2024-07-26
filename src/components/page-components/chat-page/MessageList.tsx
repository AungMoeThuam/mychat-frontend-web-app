import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import MessageCard from "./message/Message";
import { Message } from "../../../lib/models/models";

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
            if (item.isDeletedByReceiver) {
              /*
            if the current user is the receiver of that message and it is deleted by him,
            then exclude that message
            */

              return item.receiverId !== currentUserId;
            }
            //otherwises display the message
            else return true;
          })

          .map((msg: Message, index: number) => {
            return (
              <MessageCard
                key={msg.messageId}
                message={msg}
                currentUserId={currentUserId}
                previousMessageDate={
                  messagesList[index - 1]
                    ? messagesList[index - 1].createdAt
                    : null
                }
              />
            );
          })}
      </>
    );
}

export default MessageList;
