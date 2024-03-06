import { Dispatch, SetStateAction, useContext, useState } from "react";
import { User } from "../../../../../utils/types";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../../../../redux/store/store";
import { Api } from "../../../../../services/api";
import { searchfriendNameThunk } from "../../../../../redux/thunks/searchFriendThunks";
import Modal from "../../../../modal/Modal";
import toast from "react-hot-toast";
import { RelationshipActionDialogs } from "../AddFriendCard";
import { SearchNameContext } from "../../../../../pages/addfriends/AddFriends.page";

export default function RejectOrCancelFriendRequestDialog({
  RejectOrCancelDialog,
  people,
  setRejectOrCancelFriendRequestDialog,
  currentUserId,
  searchName,
}: {
  RejectOrCancelDialog: "cancel" | "reject";
  people: User;
  setRejectOrCancelFriendRequestDialog: Dispatch<
    SetStateAction<RelationshipActionDialogs>
  >;
  currentUserId: string;
  searchName: string | null;
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
      const res = await Api.manageFriendShipStatus({
        relationshipStatus: 0,
        type: "reject",
        id: people._id,
        currentUserId,
      });
      if (res.status === "success") {
        toast("rejected successfully!");
        setOperation((prev) => ({ ...prev, loading: false, success: true }));
        setRejectOrCancelFriendRequestDialog((prev) => ({
          ...prev,
          openRejectOrCancelFriendRequestDialog: false,
        }));
        console.log("searchname in dialog - ", searchName);
        dispatch(searchfriendNameThunk(searchNameContextConsumer));
      } else {
        toast.error(res.message + " ❌❌❌", { duration: 4000 });
        setOperation((prev) => ({ ...prev, loading: false, error: true }));
      }
    } catch (error: any) {
      console.error(error);
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
                ? `cancel a friend request to ${people.name}`
                : ` reject friend request from ${people.name}`}
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
