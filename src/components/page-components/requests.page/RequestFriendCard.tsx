import { useState } from "react";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../../redux/store/store";
import { FriendShipApi } from "../../../services/friendshipApi";
import RequestActionDialog from "./RequestActionDialog";
import { backendUrlWihoutApiEndpoint } from "../../../utils/backendConfig";
import { tempCatPhoto } from "../../../utils/helper";
import { acceptRequestAction } from "../../../redux/slices/requestSlice";
import { getFriendsListAction } from "../../../redux/actions/friendThunks";
import { Friend } from "../../../utils/types";

export default function RequestFriendCard({ friend }: { friend: Friend }) {
  const [requestActionDialog, setRequestActionDialog] = useState(false);
  const [operation, setOperation] = useState({
    loading: false,
    error: false,
    success: false,
  });
  const dispatch = useDispatch<StoreDispatch>();
  const acceptRequest = async () => {
    try {
      const result = await FriendShipApi.manageFriendShipStatus({
        type: "accept",
        relationshipStatus: 1,
        id: friend.friendId,
        currentUserId: friend.receipent,
      });
      if (result.status === "success") {
        dispatch(acceptRequestAction(friend.friendId));
        dispatch(getFriendsListAction());
      } else {
        setOperation((prev) => ({ ...prev, loading: false, error: true }));
      }
    } catch (error: unknown) {
      setOperation((prev) => ({ ...prev, loading: false, error: true }));
    }
  };
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
          disabled={operation.loading ? true : false}
          onClick={acceptRequest}
          className=" btn btn-sm bg-teal-500 border-none text-black"
        >
          {operation.loading ? "...loading" : "Accept"}
        </button>
        <button
          onClick={() => setRequestActionDialog(true)}
          className=" btn btn-sm  bg-slate-950 border-none text-slate-400"
        >
          Reject
        </button>
      </div>
      {requestActionDialog && (
        <RequestActionDialog
          friend={friend}
          onClose={() => setRequestActionDialog(false)}
        />
      )}
    </div>
  );
}
