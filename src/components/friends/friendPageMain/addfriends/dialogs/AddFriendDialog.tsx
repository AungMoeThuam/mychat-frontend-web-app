import { RefObject, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../../../../redux/store/store";
import { FriendShipApi } from "../../../../../service/friend-api-service";
import { searchfriendNameThunk } from "../../../../../redux/features/people/peopleThunks";
import toast from "react-hot-toast";
import { SearchNameContext } from "../../../../../pages/search-people/SearchPeoplePage";
import {
  operationError,
  operationLoading,
  operationSuccess,
} from "../../../../../redux/slices/friendshipDialogSlice";
import { Person } from "../../../../../lib/models/models";
import Dialog from "../../../../share-components/Dialog";

export default function AddFriendDialog({
  people,
  dialogRef,
  currentUserId,
}: {
  people: Person;
  dialogRef: RefObject<HTMLDialogElement>;
  currentUserId: string;
}) {
  const searchNameContextConsumer = useContext(SearchNameContext);
  const operation = useSelector(
    (state: RootState) => state.friendshipDialogSlice
  );
  const dispatch = useDispatch<StoreDispatch>();

  const action = async (
    id: string,
    process: "cancel" | "accept" = "accept"
  ) => {
    dispatch(operationLoading());
    if (process === "cancel") return;

    try {
      const res = await FriendShipApi.manageFriendShipStatus({
        type: "request",
        friendId: id,
        currentUserId,
        friendshipId: people.friendshipId!,
      });
      if (res.error) {
        toast.error(res.error, { duration: 4000 });
        dispatch(operationError(res.error));
      } else {
        toast("requested successfully!");
        operationSuccess();
        dialogRef.current?.close();
        dispatch(
          searchfriendNameThunk(
            searchNameContextConsumer ? searchNameContextConsumer : ""
          )
        );
      }
    } catch (error: any) {
      toast.error(error.message + " ❌❌❌", { duration: 4000 });
      operationError(error.message);
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
          <button
            onClick={() => {
              dispatch(searchfriendNameThunk(searchNameContextConsumer));

              dialogRef.current?.close();
            }}
            className=" btn-success"
          >
            Refresh
          </button>
        </div>
      ) : (
        <>
          <h1>Are u sure to add friend to {people.personName}? </h1>
          <div className="flex  justify-center gap-5 ">
            <button
              onClick={() => {
                action(people.personId);
              }}
              className=" btn-warning"
            >
              Yes
            </button>
            <button
              onClick={() => dialogRef.current?.close()}
              className="btn-success"
            >
              No
            </button>
          </div>
        </>
      )}
    </Dialog>
  );
}
