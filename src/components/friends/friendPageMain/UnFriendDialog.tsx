import { useState } from "react";
import { FriendShipApi } from "../../../services/friendshipApi";
import Modal from "../../global-components/modal/Modal";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../../redux/store/store";
import { unFriendUpdate } from "../../../redux/slices/friendSlice";
import toast from "react-hot-toast";

interface UnFriendDialogProps {
  friendName: string;
  friendId: string;
  userId: string;
  onClose: () => void;
}
export default function UnFriendDialog({
  friendName,
  friendId,
  userId,
  onClose,
}: UnFriendDialogProps) {
  const dispatch = useDispatch<StoreDispatch>();
  const [operation, setOperation] = useState({
    error: false,
    loading: false,
    success: false,
    message: "",
  });
  const unFriend = async () => {
    setOperation((prev) => ({ ...prev, loading: true }));
    try {
      const result = await FriendShipApi.unFriend({
        id: friendId,
        currentUserId: userId,
      });
      if (result.error)
        return setOperation((prev) => ({
          ...prev,
          loading: false,
          error: true,
          message: result.error ? result.error : "error",
        }));

      toast("UnFriended! ✅");
      onClose();
      dispatch(unFriendUpdate({ friendId }));
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
                Are u sure to unfriend <b>{friendName}</b> ?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={unFriend}
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
