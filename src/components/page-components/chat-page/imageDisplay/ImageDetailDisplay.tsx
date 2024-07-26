import { ImCross } from "react-icons/im";
import Modal from "../../../share-components/Modal";
import { backendUrlWihoutApiEndpoint } from "../../../../utils/backendConfig";

export default function ImageDetailDisplayDialog({
  imageUrl,
  onClose,
}: {
  imageUrl: string;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{ zIndex: 1000, height: "100vh" }}
        className=" absolute bottom-0   bg-opacity-50  left-0 right-0 top-0  bg-slate-700  flex flex-col justify-center py-4 px-2 items-center gap-2"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className=" flex justify-center"
        >
          <img
            style={{ height: "90dvh" }}
            className=" relative object-contain aspect-auto  rounded-lg"
            src={`${backendUrlWihoutApiEndpoint}/resources/chats/${imageUrl}`}
            alt="cat"
          />
          <button
            onClick={onClose}
            className=" absolute right-4 top-5 rounded-md p-2 bg-black text-white"
          >
            <ImCross />
          </button>
        </div>
      </div>
    </Modal>
  );
}
