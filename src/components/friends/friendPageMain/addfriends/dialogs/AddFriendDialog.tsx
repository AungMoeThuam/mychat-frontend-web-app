import { Dispatch, SetStateAction, useContext } from "react";
import { User } from "../../../../../utils/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../../../../redux/store/store";
import { FriendShipApi } from "../../../../../services/friendshipApi";
import { searchfriendNameThunk } from "../../../../../redux/actions/searchFriendThunks";
import Modal from "../../../../global-components/modal/Modal";
import toast from "react-hot-toast";
import { RelationshipActionDialogs } from "../AddFriendCard";
import { SearchNameContext } from "../../../../../pages/addfriends/AddFriends.page";
import {
  operationError,
  operationLoading,
  operationSuccess,
} from "../../../../../redux/slices/friendshipDialogSlice";

export default function AddFriendDialog({
  people,
  setUnFriendShipActionDialog,
  currentUserId,
  searchName,
}: {
  people: User;
  setUnFriendShipActionDialog: Dispatch<
    SetStateAction<RelationshipActionDialogs>
  >;
  currentUserId: string;
  searchName: string | null;
}) {
  const searchNameContextConsumer = useContext(SearchNameContext);
  const operation = useSelector(
    (state: RootState) => state.friendshipDialogSlice
  );
  const dispatch = useDispatch<StoreDispatch>();

  const action = async (
    id: string,
    relationshipStatus: number = 0,
    process: "cancel" | "accept" = "accept"
  ) => {
    dispatch(operationLoading());
    if (process === "cancel") return;

    try {
      const res = await FriendShipApi.manageFriendShipStatus({
        relationshipStatus,
        type: "request",
        id,
        currentUserId,
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
        dispatch(searchfriendNameThunk(searchName ? searchName : ""));
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
            <h1>Are u sure to add friend to {people.name}? </h1>
            <div className="flex  justify-center gap-5 ">
              <button
                onClick={() => {
                  action(people._id, people.status);
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
