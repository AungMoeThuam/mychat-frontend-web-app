import { RefObject, useState } from "react";
import { FriendShipApi } from "../../../service/friend-api-service";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../../redux/store/store";
import { unFriend } from "../../../redux/features/friend/friendSlice";
import toast from "react-hot-toast";
import { Friend } from "../../../lib/models/models";
import Dialog from "../../share-components/Dialog";

interface UnFriendDialogProps {
  friend: Friend;
  dialogRef: RefObject<HTMLDialogElement>;
}
export default function UnFriendDialog({
  friend,
  dialogRef,
}: UnFriendDialogProps) {
  const dispatch = useDispatch<StoreDispatch>();
  const [operation, setOperation] = useState({
    error: false,
    loading: false,
    success: false,
    message: "",
  });
  const unFriendAction = async () => {
    setOperation((prev) => ({ ...prev, loading: true }));
    try {
      const result = await FriendShipApi.unFriend(friend.friendshipId);
      if (result.error)
        return setOperation((prev) => ({
          ...prev,
          loading: false,
          error: true,
          message: result.error ? result.error : "error",
        }));

      toast("UnFriended! ✅");
      dialogRef.current?.close();
      dispatch(unFriend({ friendId: friend.friendId }));
    } catch (error) {
      setOperation((prev) => ({ ...prev, loading: false, error: true }));
    }
  };
  return (
    <Dialog dialogRef={dialogRef} CloseToClickOutside={operation.error}>
      {operation.loading ? (
        <h1>loading...</h1>
      ) : operation.error ? (
        <>
          <h1>Error try refresh!</h1>
          <button
            onClick={() => dialogRef.current?.close()}
            className="btn btn-sm bg-teal-500 text-slate-950"
          >
            Refresh
          </button>
        </>
      ) : (
        <>
          <h1>UnFriend</h1>
          <div>
            <p>
              Are u sure to unfriend <b>{friend.friendName}</b> ?
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={unFriendAction}
              className="px-4 py-2 rounded-lg bg-red-500 text-zinc-950"
            >
              Yes
            </button>
            <button
              onClick={() => dialogRef.current?.close()}
              className=" px-4 py-2 rounded-lg bg-lime-500 text-zinc-900"
            >
              No
            </button>
          </div>
        </>
      )}
    </Dialog>
  );
}
