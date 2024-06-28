import { Dispatch, SetStateAction, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../../../../redux/store/store";
import { FriendShipApi } from "../../../../../service/friend-api-service";
import { searchfriendNameThunk } from "../../../../../redux/features/people/peopleThunks";
import Modal from "../../../../share-components/modal/Modal";
import toast from "react-hot-toast";
import { RelationshipActionDialogs } from "../AddFriendCard";
import { SearchNameContext } from "../../../../../pages/search-people/SearchPeoplePage";
import {
  operationError,
  operationLoading,
  operationSuccess,
} from "../../../../../redux/slices/friendshipDialogSlice";
import { Person } from "../../../../../lib/models/models";

export default function AddFriendDialog({
  people,
  setUnFriendShipActionDialog,
  currentUserId,
}: {
  people: Person;
  setUnFriendShipActionDialog: Dispatch<
    SetStateAction<RelationshipActionDialogs>
  >;
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
        setUnFriendShipActionDialog((prev) => ({
          ...prev,
          openAddFriendDialog: false,
        }));
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
    <Modal
      onClose={
        operation.loading === true || operation.error === true
          ? () => {
              return;
            }
          : () =>
              setUnFriendShipActionDialog((prev) => ({
                ...prev,
                openAddFriendDialog: false,
              }))
      }
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col py-3 px-5 gap-10 bg-slate-950 rounded-lg shadow-lg"
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
                setUnFriendShipActionDialog((prev) => ({
                  ...prev,
                  openAddFriendDialog: false,
                }));
              }}
              className=" btn btn-sm bg-teal-500 text-slate-950"
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
                className=" btn btn-sm bg-teal-500 text-slate-950"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setUnFriendShipActionDialog((prev) => ({
                    ...prev,
                    openAddFriendDialog: false,
                  }));
                }}
                className="btn  btn-sm bg-slate-900"
              >
                No
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
