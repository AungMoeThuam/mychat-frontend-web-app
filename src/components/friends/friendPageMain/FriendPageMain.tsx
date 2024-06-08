import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { Friend } from "../../../utils/constants/types";
import FriendCard from "./FriendCard";

export default function FriendPageMain() {
  const { friendsList, loading, error, message } = useSelector(
    (state: RootState) => state.friendSlice
  );

  if (loading) return <h1>...loading friends list</h1>;
  if (error) return <h1>{message}</h1>;
  console.log(friendsList);
  return (
    <div className=" flex-1 flex flex-col gap-2 overflow-y-scroll px-4 pt-3 pb-5">
      {friendsList.length === 0 ? (
        <h1>no friends yet!</h1>
      ) : (
        friendsList.map((friend: Friend) => {
          return <FriendCard key={friend.friendId} friend={friend} />;
        })
      )}
    </div>
  );
}
