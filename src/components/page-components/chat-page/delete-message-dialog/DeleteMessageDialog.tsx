import { Dispatch, SetStateAction } from "react";
import Modal from "../../../share-components/Modal";

export default function DeleteMessageDialog({
  deleteMessageAction,
  open,
  onClose,
}: {
  messageId: string;
  open: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  deleteMessageAction: () => void;
}) {
  return (
    <>
      {open !== false && (
        <Modal onClose={() => onClose(false)}>
          Are u sure to delete this message?
          <div className="flex  items-center justify-center gap-4 my-2">
            <button
              onClick={() => {
                deleteMessageAction();
                onClose(false);
              }}
              className=" btn-warning"
            >
              Yes
            </button>
            <button onClick={() => onClose(false)} className="  btn-success">
              No
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
