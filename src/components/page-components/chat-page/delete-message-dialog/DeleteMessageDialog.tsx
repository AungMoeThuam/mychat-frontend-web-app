import { Dispatch, SetStateAction } from "react";
import Modal from "../../../share-components/Modal";
import Button from "../../../share-components/Button";

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
            <Button
              onClick={() => {
                deleteMessageAction();
                onClose(false);
              }}
              type="warning"
            >
              Yes
            </Button>
            <Button onClick={() => onClose(false)}>No</Button>
          </div>
        </Modal>
      )}
    </>
  );
}
