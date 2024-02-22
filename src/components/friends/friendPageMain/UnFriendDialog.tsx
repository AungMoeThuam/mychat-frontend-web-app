import Modal from "../../modal/Modal";

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
  return (
    <Modal onClose={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className=" bg-slate-950 px-10 py-5 rounded-md shadow-lg flex flex-col justify-center items-center gap-5"
      >
        <h1>UnFriend</h1>
        <div>
          <p>
            Are u sure to unfriend <b>{friendName}</b> ?
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-sm bg-teal-500 text-slate-950">Yes</button>
          <button onClick={onClose} className="btn btn-sm bg-slate-900">
            No
          </button>
        </div>
      </div>
    </Modal>
  );
}
