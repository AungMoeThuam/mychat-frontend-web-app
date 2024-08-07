import { Dispatch, RefObject, SetStateAction } from "react";
import toast from "react-hot-toast";
import { FiPaperclip } from "react-icons/fi";

type FilePickerProps = {
  setFile: Dispatch<SetStateAction<File | null>>;
  roomId: string;
  submitBtnRef: RefObject<HTMLButtonElement>;
};
export default function FilePicker(props: FilePickerProps) {
  const { setFile, submitBtnRef } = props;
  return (
    <label
      htmlFor="dropzone-file"
      style={{ color: "#68686E" }}
      className=" flex flex-col items-center justify-center border-2 border-gray-300  border-hidden rounded-lg cursor-pointer "
    >
      <FiPaperclip className="text-zinc-950 dark:text-lime-500" size={20} />

      <input
        onChange={(e) => {
          if (
            e.target.files &&
            e.target.files[0] &&
            e.target.files[0].size < 1e8
          ) {
            setFile(e.target.files[0]);
          } else
            toast("File size should be less than 100MB!", {
              icon: "⚠️",
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });

          e.target.value = "";

          submitBtnRef.current?.focus();
        }}
        onKeyDown={() => alert("h")}
        id="dropzone-file"
        type="file"
        className="hidden"
      />
    </label>
  );
}
