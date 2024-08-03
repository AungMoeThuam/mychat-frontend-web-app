import { RefObject, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../../../../redux/store/store";
import { searchfriendNameThunk } from "../../../../../redux/features/people/peopleThunks";
import toast from "react-hot-toast";
import { SearchNameContext } from "../../../../../pages/SearchPeople";
import Dialog from "../../../../share-components/Dialog";
import friendService from "../../../../../service/friend.service";
import { Person } from "../../../../../lib/types/types";
import Button from "../../../../share-components/Button";

export default function RejectOrCancelFriendRequestDialog({
  RejectOrCancelDialog,
  people,
  dialogRef,
  currentUserId,
}: {
  RejectOrCancelDialog: "cancel" | "reject";
  people: Person;
  dialogRef: RefObject<HTMLDialogElement>;
  currentUserId: string;
}) {
  const searchNameContextConsumer = useContext(SearchNameContext);
  const dispatch = useDispatch<StoreDispatch>();
  const [operation, setOperation] = useState({
    error: false,
    loading: false,
    message: "",
    success: false,
  });
  const action = async () => {
    setOperation((prev) => ({ ...prev, loading: true }));

    try {
      const res = await friendService.manageFriendShipStatus({
        type: "reject",
        friendId: people.personId,
        currentUserId,
        friendshipId: people.friendshipId!,
      });
      if (res.error) {
        toast.error(res.error + " ❌❌❌", { duration: 4000 });
        setOperation((prev) => ({ ...prev, loading: false, error: true }));
      } else {
        toast("rejected successfully!");
        setOperation((prev) => ({ ...prev, loading: false, success: true }));
        dialogRef.current?.close();
        dispatch(searchfriendNameThunk(searchNameContextConsumer));
      }
    } catch (error: any) {
      toast.error(error.message + " ❌❌❌", { duration: 4000 });
      setOperation((prev) => ({ ...prev, loading: false, error: true }));
    }
  };

  return (
    <Dialog
      dialogRef={dialogRef}
      CloseToClickOutside={
        operation.loading === true || operation.error === true
      }
    >
      {operation.loading ? (
        <h1>Loading...</h1>
      ) : operation.error ? (
        <div className="flex  justify-center gap-5 ">
          <h1>
            There is a conflict concurrent request at the moment! try refresh
          </h1>
          <Button
            onClick={() => {
              dialogRef.current?.close();
              dispatch(searchfriendNameThunk(searchNameContextConsumer));
            }}
          >
            Refresh
          </Button>
        </div>
      ) : (
        <>
          <h1>
            Are u sure to{" "}
            {RejectOrCancelDialog === "cancel"
              ? `cancel a friend request to ${people.personName}`
              : ` reject friend request from ${people.personName}`}
            ?
          </h1>
          <div className="flex  justify-center gap-5 ">
            <Button onClick={action} type="warning">
              Yes
            </Button>
            <Button onClick={() => dialogRef.current?.close()}>No</Button>
          </div>
        </>
      )}
    </Dialog>
  );
}
