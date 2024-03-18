import { Dispatch, SetStateAction } from "react";
import { FiPaperclip } from "react-icons/fi";

type FilePickerProps = {
  setFile: Dispatch<SetStateAction<File | null>>;
};

export default function FilePicker({ setFile }: FilePickerProps) {
  return (
    <label
      htmlFor="dropzone-file"
      style={{ color: "#68686E" }}
      className=" flex flex-col items-center justify-center border-2 border-gray-300  border-hidden rounded-lg cursor-pointer "
    >
      <FiPaperclip size={20} />

      <input
        onChange={(e) => {
          if (
            e.target.files &&
            e.target.files[0] &&
            e.target.files[0].size < 1e8
          ) {
            setFile(e.target.files[0]);
          } else alert("file too large");
          e.target.value = "";
        }}
        id="dropzone-file"
        type="file"
        className="hidden"
      />
    </label>
  );
}
