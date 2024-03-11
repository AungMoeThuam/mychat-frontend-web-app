import { useDispatch } from "react-redux";
import { FriendShipApi } from "../../../services/friendshipApi";
import { Friend } from "../../../utils/types";
import Modal from "../../global-components/modal/Modal";
import { StoreDispatch } from "../../../redux/store/store";
import { acceptRequestAction } from "../../../redux/slices/requestSlice";
import { useState } from "react";

type RequestActionDialog = {
  onClose: () => void;
  friend: Friend;
};
export default function RequestActionDialog({
  onClose,
  friend,
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
      const result = await FriendShipApi.manageFriendShipStatus({
        type: "reject",
        currentUserId: friend.receipent,
        id: friend.friendId,
        relationshipStatus: 1,
      });
      if (result.status === "success") {
        setOperation((prev) => ({
          ...prev,
          loading: false,
        }));
        dispatch(acceptRequestAction(friend.friendId));
      } else {
        setOperation((prev) => ({
          ...prev,
          error: true,
          loading: false,
          message: result.message,
        }));
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
            <h1>Are u sure to reject the request from {friend.name}?</h1>
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
