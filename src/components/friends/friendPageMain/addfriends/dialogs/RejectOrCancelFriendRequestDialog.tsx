import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../../../../redux/store/store";
import { FriendShipApi } from "../../../../../service/friend-api-service";
import { searchfriendNameThunk } from "../../../../../redux/features/people/peopleThunks";
import Modal from "../../../../share-components/modal/Modal";
import toast from "react-hot-toast";
import { RelationshipActionDialogs } from "../AddFriendCard";
import { SearchNameContext } from "../../../../../pages/search-people/SearchPeoplePage";
import { Person } from "../../../../../lib/models/models";

export default function RejectOrCancelFriendRequestDialog({
  RejectOrCancelDialog,
  people,
  setRejectOrCancelFriendRequestDialog,
  currentUserId,
}: {
  RejectOrCancelDialog: "cancel" | "reject";
  people: Person;
  setRejectOrCancelFriendRequestDialog: Dispatch<
    SetStateAction<RelationshipActionDialogs>
  >;
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
      const res = await FriendShipApi.manageFriendShipStatus({
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
        setRejectOrCancelFriendRequestDialog((prev) => ({
          ...prev,
          openRejectOrCancelFriendRequestDialog: false,
        }));

        dispatch(searchfriendNameThunk(searchNameContextConsumer));
      }
    } catch (error: any) {
      toast.error(error.message + " ❌❌❌", { duration: 4000 });
      setOperation((prev) => ({ ...prev, loading: false, error: true }));
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
              setRejectOrCancelFriendRequestDialog((prev) => ({
                ...prev,
                openRejectOrCancelFriendRequestDialog: false,
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
                setRejectOrCancelFriendRequestDialog((prev) => ({
                  ...prev,
                  openRejectOrCancelFriendRequestDialog: false,
                }));
                dispatch(searchfriendNameThunk(searchNameContextConsumer));
              }}
              className=" btn btn-sm bg-teal-500 text-slate-950"
            >
              Refresh
            </button>
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
              <button
                onClick={action}
                className=" btn btn-sm bg-teal-500 text-slate-950"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setRejectOrCancelFriendRequestDialog((prev) => ({
                    ...prev,
                    openRejectOrCancelFriendRequestDialog: false,
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
