import { RefObject, useState } from "react";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../../redux/store/store";
import { unFriend } from "../../../redux/features/friend/friendSlice";
import toast from "react-hot-toast";
import Dialog from "../../share-components/Dialog";
import { Friend } from "../../../lib/types/types";
import friendService from "../../../service/friend.service";
import Button from "../../share-components/Button";

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
      const result = await friendService.unFriend(friend.friendshipId);
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

          <Button onClick={() => dialogRef.current?.close()}>Refresh</Button>
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
            <Button onClick={unFriendAction} type="warning">
              Yes
            </Button>

            <Button onClick={() => dialogRef.current?.close()}>No</Button>
          </div>
        </>
      )}
    </Dialog>
  );
}
