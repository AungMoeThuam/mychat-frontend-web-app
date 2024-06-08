import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../redux/store/store";
import { getBlocksListThunk } from "../../redux/features/friend-block/blockThunks";
import BlockFriendCard from "../../components/page-components/block-page/BlockFriendCard";

export default function BlocksPage() {
  const { loading, error, message, blocksList } = useSelector(
    (state: RootState) => state.blockSlice
  );
  const dispatch = useDispatch<StoreDispatch>();
  const currentUserId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );
  useEffect(() => {
    dispatch(getBlocksListThunk(currentUserId));
  }, []);
  if (loading) return <h1>...loading</h1>;
  if (error) return <h1>{message}</h1>;

  return (
    <div className="  flex-1 flex flex-col gap-1 overflow-y-scroll px-4 pt-3 pb-5">
      {blocksList.length === 0 ? (
        <h1>no blocks yet!</h1>
      ) : (
        blocksList.map((friend) => {
          return <BlockFriendCard key={friend.friendId} friend={friend} />;
        })
      )}
    </div>
  );
}
