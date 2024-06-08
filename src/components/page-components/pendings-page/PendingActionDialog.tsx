import { useDispatch } from "react-redux";
import { FriendShipApi } from "../../../service/friend-api-service";
import { Friend } from "../../../utils/constants/types";
import Modal from "../../share-components/modal/Modal";
import { StoreDispatch } from "../../../redux/store/store";
import { useState } from "react";
import { cancelPendingAction } from "../../../redux/features/friend-pending/pendingSlice";
import toast from "react-hot-toast";

type PendingActionDialog = {
  onClose: () => void;
  friend: Friend;
};
export default function PendingActionDialog({
  onClose,
  friend,
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
      const result = await FriendShipApi.manageFriendShipStatus({
        type: "reject",
        currentUserId: friend.requester,
        friendId: friend.friendId,
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
        dispatch(cancelPendingAction(friend.friendId));
        toast("request has been canceled!");
        onClose();
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
    <Modal
      onClose={
        operation.loading
          ? () => {
              return;
            }
          : onClose
      }
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-950 p-5 rounded shadow-lg "
      >
        {operation.loading ? (
          <h1>...loading</h1>
        ) : operation.error ? (
          <h1>{operation.message} </h1>
        ) : (
          <>
            <h1>Are u sure to cancel the request to {friend.name}?</h1>
            <div className="flex justify-center gap-4 ">
              <button onClick={rejectRequest} className="btn btn-sm btn-error">
                Yes
              </button>
              <button onClick={onClose} className="btn btn-sm  bg-slate-900">
                No
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
