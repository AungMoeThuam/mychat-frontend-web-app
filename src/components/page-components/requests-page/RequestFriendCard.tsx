import { useState } from "react";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../../redux/store/store";
import { FriendShipApi } from "../../../service/friend-api-service";
import RequestActionDialog from "./RequestActionDialog";
import { backendUrlWihoutApiEndpoint } from "../../../utils/backendConfig";
import { tempCatPhoto } from "../../../assets/temporaryProfilePhoto";
import { acceptRequestAction } from "../../../redux/features/friend-request/requestSlice";
import { fetchFriends } from "../../../redux/features/friend/friendThunks";
import { Person } from "../../../lib/models/models";

export default function RequestFriendCard({ person }: { person: Person }) {
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
        friendId: person.personId,
        currentUserId: person.friendshipReceiverId!,
        friendshipId: person.friendshipId!,
      });
      if (result.error)
        setOperation((prev) => ({ ...prev, loading: false, error: true }));
      else {
        dispatch(acceptRequestAction(person.personId));
        dispatch(fetchFriends());
      }
    } catch (error: unknown) {
      setOperation((prev) => ({ ...prev, loading: false, error: true }));
    }
  };
  return (
    <div className="flex  gap-2  justify-between p-2 rounded  items-center pr-4 hover:bg-teal-900">
      <div className="flex gap-2 items-center">
        <img
          className=" avatar w-10 h-10 rounded-full object-cover"
          src={
            person.profilePhoto
              ? `${backendUrlWihoutApiEndpoint}/resources/profiles/${person.profilePhoto.path}`
              : tempCatPhoto
          }
        />

        <h1>{person.personName}</h1>
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
          person={person}
          onClose={() => setRequestActionDialog(false)}
        />
      )}
    </div>
  );
}
