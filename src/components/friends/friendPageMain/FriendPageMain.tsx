import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { Friend } from "../../../utils/types";
import FriendCard from "./FriendCard";

export default function FriendPageMain() {
  const { friendsList, loading, success, error } = useSelector(
    (state: RootState) => state.friendSlice
  );
  return (
    <div className=" flex-1 flex flex-col gap-2 overflow-y-scroll px-4 pt-3 pb-5">
      {friendsList.map((friend: Friend) => {
        return <FriendCard key={friend.friendId} friend={friend} />;
      })}
    </div>
  );
}
