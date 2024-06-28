import { useState } from "react";
import { FriendShipApi } from "../../../service/friend-api-service";
import Modal from "../../share-components/modal/Modal";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../../redux/store/store";
import { unFriend } from "../../../redux/features/friend/friendSlice";
import toast from "react-hot-toast";
import { Friend } from "../../../lib/models/models";

interface UnFriendDialogProps {
  friend: Friend;
  onClose: () => void;
}
export default function UnFriendDialog({
  friend,
  onClose,
}: UnFriendDialogProps) {
  const dispatch = useDispatch<StoreDispatch>();
  const [operation, setOperation] = useState({
    error: false,
    loading: false,
    success: false,
    message: "",
  });
  const unFriendAction = async () => {
    setOperation((prev) => ({ ...prev, loading: true }));
    try {
      const result = await FriendShipApi.unFriend(friend.friendshipId);
      if (result.error)
        return setOperation((prev) => ({
          ...prev,
          loading: false,
          error: true,
          message: result.error ? result.error : "error",
        }));

      toast("UnFriended! ✅");
      onClose();
      dispatch(unFriend({ friendId: friend.friendId }));
    } catch (error) {
      setOperation((prev) => ({ ...prev, loading: false, error: true }));
    }
  };
  return (
    <Modal
      onClose={
        operation.error
          ? () => {
              return;
            }
          : onClose
      }
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className=" bg-slate-950 px-10 py-5 rounded-md shadow-lg flex flex-col justify-center items-center gap-5"
      >
        {operation.loading ? (
          <h1>loading...</h1>
        ) : operation.error ? (
          <>
            <h1>Error try refresh!</h1>
            <button
              onClick={onClose}
              className="btn btn-sm bg-teal-500 text-slate-950"
            >
              Refresh
            </button>
          </>
        ) : (
          <>
            <h1>UnFriend</h1>
            <div>
              <p>
                Are u sure to unfriend <b>{friend.friendName}</b> ?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={unFriendAction}
                className="btn btn-sm bg-teal-500 text-slate-950"
              >
                Yes
              </button>
              <button onClick={onClose} className="btn btn-sm bg-slate-900">
                No
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
