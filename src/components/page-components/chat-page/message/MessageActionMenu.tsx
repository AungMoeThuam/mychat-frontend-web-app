import { RefObject } from "react";
import toast from "react-hot-toast";
import { BsTrashFill, BsSaveFill } from "react-icons/bs";
import { API_BASE_URL } from "../../../../service/api";

interface MessageActionMenuProps {
  deleteMessageDialog: RefObject<HTMLDialogElement>;
  content: string;
  type: string;
  isCurrentUserTheSender: boolean;
}

export default function MessageActionMenu({
  isCurrentUserTheSender,
  content,
  type,
  deleteMessageDialog,
}: MessageActionMenuProps) {
  return (
    <menu
      id="menu"
      style={
        isCurrentUserTheSender
          ? {
              left: "-8dvh",
              top: "50%",
              transform: "translateY(-50%)",
            }
          : {
              right: "-8dvh",
              top: "50%",
              transform: "translateY(-50%)",
            }
      }
      className="absolute text-teal-500 opacity-50"
    >
      <div className="flex flex-col justify-center items-center cursor-pointer  text-lime-500 gap-3 ">
        <BsTrashFill
          onClick={() => deleteMessageDialog.current?.showModal()}
          size={20}
        />

        {!type?.includes("text") && (
          <BsSaveFill
            onClick={async (e) => {
              e.preventDefault();
              let a: HTMLAnchorElement | null = document.createElement("a");
              let b = await fetch(`${API_BASE_URL}/resources/chats/${content}`);
              let c = await b.blob();
              a.href = URL.createObjectURL(c);
              a.download = content;
              a.target = "_blank";
              a.click();
              a = null;
              toast("Save a file ✅ ");
            }}
            size={20}
          />
        )}
      </div>
    </menu>
  );
}
