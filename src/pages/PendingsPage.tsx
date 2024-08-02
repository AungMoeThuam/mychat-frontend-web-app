import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../redux/store/store";
import { getPendingsListThunk } from "../redux/features/friend-pending/pendingThunks";
import PendingFriendCard from "../components/page-components/pendings-page/PendingFriendCard";

export default function PendingsPage() {
  const { loading, error, message, pendingsList } = useSelector(
    (state: RootState) => state.pendingSlice
  );
  const dispatch = useDispatch<StoreDispatch>();
  const currentUserId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );
  useEffect(() => {
    dispatch(getPendingsListThunk(currentUserId));
  }, []);
  if (loading) return <h1>...loading</h1>;
  if (error) return <h1>{message}</h1>;
  console.log("pending list ", pendingsList);
  return (
    <div className="  flex-1 flex flex-col gap-1 overflow-y-scroll px-4 pt-3 pb-5">
      {pendingsList.length === 0 ? (
        <h1>no requests yet!</h1>
      ) : (
        pendingsList.map((person) => {
          return (
            <PendingFriendCard key={person.friendshipId} person={person} />
          );
        })
      )}
    </div>
  );
}
