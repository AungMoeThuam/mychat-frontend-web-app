import { Dispatch, SetStateAction } from "react";
import Modal from "../../modal/Modal";

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
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ zIndex: 100 }}
            className="  text-black rounded-md bg-white p-6"
          >
            Are u sure to delete this message?
            <div className="flex  items-center justify-center gap-4 my-2">
              <button
                onClick={() => {
                  deleteMessageAction();
                  onClose(false);
                }}
                className=" bg-red-500 px-10 py-2 rounded-md"
              >
                Yes
              </button>
              <button
                onClick={() => onClose(false)}
                className=" bg-slate-800 text-white px-10 py-2 rounded-md"
              >
                No
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
