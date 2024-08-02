import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../../redux/store/store";
import { RefObject, useState } from "react";
import toast from "react-hot-toast";
import { cancelBlockAction } from "../../../redux/features/friend-block/blockSlice";
import Dialog from "../../share-components/Dialog";
import { Friend } from "../../../lib/types/types";
import friendService from "../../../service/friend.service";
import Button from "../../share-components/Button";

type UnblockActionDialog = {
  dialogRef: RefObject<HTMLDialogElement>;
  friend: Friend;
};
export default function UnblockActionDialog({
  dialogRef,
  friend,
}: UnblockActionDialog) {
  const dispatch = useDispatch<StoreDispatch>();
  const [operation, setOperation] = useState({
    loading: false,
    error: false,
    success: false,
    message: "",
  });
  const currentUserId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );
  const removeBlock = async () => {
    try {
      const result = await friendService.unblock(
        friend.friendshipId!,
        currentUserId
      );
      if (result.error !== null)
        setOperation((prev) => ({
          ...prev,
          error: true,
          loading: false,
          message: result.error ? result.error : "unknown error",
        }));
      else {
        setOperation((prev) => ({
          ...prev,
          loading: false,
        }));
        dispatch(cancelBlockAction(friend.friendshipId!));
        toast("unblock has been unblocked!");
        dialogRef.current?.close();
      }
    } catch (error: any) {
      setOperation((prev) => ({
        ...prev,
        error: true,
        loading: false,
        message: error.message,
      }));
    }
  };
  return (
    <Dialog dialogRef={dialogRef} CloseToClickOutside={operation.loading}>
      {operation.loading ? (
        <h1>...loading</h1>
      ) : operation.error ? (
        <h1>{operation.message} </h1>
      ) : (
        <>
          <h1>Are u sure to unblock {friend.friendName}?</h1>
          <div className="flex justify-center gap-4 ">
            <Button onClick={removeBlock} type="warning">
              Yes
            </Button>
            <Button onClick={() => dialogRef.current?.close()}>No</Button>
          </div>
        </>
      )}
    </Dialog>
  );
}
