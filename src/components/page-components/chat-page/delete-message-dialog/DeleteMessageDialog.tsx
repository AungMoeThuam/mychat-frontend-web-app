import { Dispatch, SetStateAction } from "react";
import Modal from "../../../share-components/Modal";

export default function DeleteMessageDialog({
  deleteMessageAction,
  messageId,
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
              className="btn btn-active btn-sm  bg-red-500 text-zinc-950"
            >
              Yes
            </button>
            <button
              onClick={() => onClose(false)}
              className=" bg-lime-500 text-zinc-950 px-10 py-2 rounded-md"
            >
              No
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
