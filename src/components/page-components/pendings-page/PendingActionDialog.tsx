import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../../redux/store/store";
import { RefObject, useState } from "react";
import { cancelPendingAction } from "../../../redux/features/friend-pending/pendingSlice";
import toast from "react-hot-toast";
import Dialog from "../../share-components/Dialog";
import friendService from "../../../service/friend.service";
import { Person } from "../../../lib/types/types";
import Button from "../../share-components/Button";

type PendingActionDialog = {
  dialogRef: RefObject<HTMLDialogElement>;
  person: Person;
};
export default function PendingActionDialog({
  dialogRef,
  person,
}: PendingActionDialog) {
  const dispatch = useDispatch<StoreDispatch>();
  const [operation, setOperation] = useState({
    loading: false,
    error: false,
    success: false,
    message: "",
  });
  const rejectRequest = async () => {
    try {
      const result = await friendService.manageFriendShipStatus({
        type: "reject",
        currentUserId: person.friendshipInitiatorId!,
        friendId: person.personId,
        friendshipId: person.friendshipId!,
      });
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
        dispatch(cancelPendingAction(person.personId));
        toast("request has been canceled!");
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
          <h1>Are u sure to cancel the request to {person.personName}?</h1>
          <div className="flex justify-center gap-4 ">
            <Button onClick={rejectRequest} type="warning">
              Yes
            </Button>
            <Button onClick={() => dialogRef.current?.close()}>No</Button>
          </div>
        </>
      )}
    </Dialog>
  );
}
