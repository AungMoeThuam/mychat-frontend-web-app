import { useEffect, useState } from "react";
import { Friend } from "../../utils/types";
import { backendUrlWihoutApiEndpoint } from "../../utils/backendConfig";
import { tempCatPhoto } from "../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../redux/store/store";

import { getPendingsListThunk } from "../../redux/thunks/pendingThunks";

import PendingActionDialog from "../../components/page-components/pendings.page/PendingActionDialog";

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
  return (
    <div className="  flex-1 flex flex-col gap-1 overflow-y-scroll px-4 pt-3 pb-5">
      {pendingsList.length === 0 ? (
        <h1>no requests yet!</h1>
      ) : (
        pendingsList.map((friend) => {
          return <PendingFriendCard key={friend.friendId} friend={friend} />;
        })
      )}
    </div>
  );
}

function PendingFriendCard({ friend }: { friend: Friend }) {
  const [pendingActionDialog, setPendingActionDialog] = useState(false);

  return (
    <div className="flex  gap-2  justify-between p-2 rounded  items-center pr-4 hover:bg-teal-900">
      <div className="flex gap-2 items-center">
        <img
          className=" avatar w-10 h-10 rounded-full"
          src={
            friend.profilePhoto
              ? `${backendUrlWihoutApiEndpoint}/resources/profiles/${friend.profilePhoto.path}`
              : tempCatPhoto
          }
        />

        <h1>{friend.name}</h1>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => setPendingActionDialog(true)}
          className=" btn btn-sm  bg-slate-950 border-none text-slate-400"
        >
          Cancel
        </button>
      </div>
      {pendingActionDialog && (
        <PendingActionDialog
          friend={friend}
          onClose={() => setPendingActionDialog(false)}
        />
      )}
    </div>
  );
}
