import { Dispatch, SetStateAction, forwardRef } from "react";
import { FaRegPlayCircle } from "react-icons/fa";
import { ImCross } from "react-icons/im";

type SelectedFileDisplayerProps = {
  isImage: boolean;
  setFile: Dispatch<SetStateAction<File | null>>;
};
const SelectedFileDisplayer = forwardRef<
  HTMLImageElement,
  SelectedFileDisplayerProps
>(function SelectFileDisplay(props: SelectedFileDisplayerProps, ref) {
  const { isImage, setFile } = props;
  return (
    <>
      <div className="  flex-1 flex justify-center  ">
        <div className="relative">
          {!isImage && (
            <div
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
              className="absolute"
            >
              <FaRegPlayCircle size={30} />
            </div>
          )}

          <img className="  w-20 lg:w-28" ref={ref} />

          <button
            className="absolute -top-2 -right-2 rounded-full text-white bg-slate-900 p-1"
            onClick={() => {
              setFile(null);
            }}
          >
            <ImCross size={10} />
          </button>
        </div>
      </div>
    </>
  );
});

export default SelectedFileDisplayer;
