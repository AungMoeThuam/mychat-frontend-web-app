import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../redux/store/store";
import { getRequestsListThunk } from "../redux/features/friend-request/requestThunks";
import RequestFriendCard from "../components/page-components/requests-page/RequestFriendCard";

export default function RequestsPage() {
  const { loading, error, message, requestsList } = useSelector(
    (state: RootState) => state.requestSlice
  );
  const dispatch = useDispatch<StoreDispatch>();
  const currentUserId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );
  useEffect(() => {
    dispatch(getRequestsListThunk(currentUserId));
  }, []);
  if (loading) return <h1>...loading</h1>;
  if (error) return <h1>{message}</h1>;
  return (
    <div className="  flex-1 flex flex-col gap-1 overflow-y-scroll px-4 pt-3 pb-5">
      {requestsList.length === 0 ? (
        <h1>no requests yet!</h1>
      ) : (
        requestsList.map((person) => {
          return (
            <RequestFriendCard key={person.friendshipId} person={person} />
          );
        })
      )}
    </div>
  );
}
