import { RefObject, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../../../../redux/store/store";
import { searchfriendNameThunk } from "../../../../../redux/features/people/peopleThunks";
import toast from "react-hot-toast";
import { SearchNameContext } from "../../../../../pages/SearchPeoplePage";
import {
  operationError,
  operationLoading,
  operationSuccess,
} from "../../../../../redux/slices/friendshipDialogSlice";
import Dialog from "../../../../share-components/Dialog";
import friendService from "../../../../../service/friend.service";
import Button from "../../../../share-components/Button";

export default function BlockFriendDialog({
  people,
  dialogRef,
  currentUserId,
}: {
  people: { friendshipId: string; friendId: string; name: string };
  currentUserId: string;
  dialogRef: RefObject<HTMLDialogElement>;
}) {
  const searchNameContextConsumer = useContext(SearchNameContext);
  const operation = useSelector(
    (state: RootState) => state.friendshipDialogSlice
  );
  const dispatch = useDispatch<StoreDispatch>();

  const action = async () => {
    dispatch(operationLoading());
    alert(people.friendshipId);
    try {
      let res = await friendService.block(
        people.friendshipId,
        currentUserId,
        people.friendId
      );

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
      dispatch(operationError(error.message));
    }
  };

  return (
    <Dialog dialogRef={dialogRef}>
      {operation.loading ? (
        <h1>Loading...</h1>
      ) : operation.error ? (
        <div className="flex  justify-center gap-5 ">
          <h1>
            There is a conflict concurrent request at the moment! try refresh
          </h1>
          <Button
            onClick={() => {
              dispatch(searchfriendNameThunk(searchNameContextConsumer));
              dialogRef.current?.close();
            }}
          >
            Refresh
          </Button>
        </div>
      ) : (
        <>
          <h1>Are u sure to block {people.name}? </h1>
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
