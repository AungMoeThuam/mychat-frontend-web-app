import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../../redux/store/store";
import { acceptRequestAction } from "../../../redux/features/friend-request/requestSlice";
import { RefObject, useState } from "react";
import Dialog from "../../share-components/Dialog";
import friendService from "../../../service/friend.service";
import { Person } from "../../../lib/types/types";
import Button from "../../share-components/Button";

type RequestActionDialog = {
  dialogRef: RefObject<HTMLDialogElement>;
  person: Person;
};
export default function RequestActionDialog({
  dialogRef,
  person,
}: RequestActionDialog) {
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
        currentUserId: person.friendshipReceiverId!,
        friendId: person.personId,
        friendshipId: person.friendshipId!,
      });
      if (result.error) {
        setOperation((prev) => ({
          ...prev,
          error: true,
          loading: false,
          message: result.error ? result.error : "unknown error",
        }));
      } else {
        setOperation((prev) => ({
          ...prev,
          loading: false,
        }));
        dispatch(acceptRequestAction(person.personId));
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
          <h1>Are u sure to reject the request from {person.personName}?</h1>
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
