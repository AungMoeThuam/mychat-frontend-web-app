import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { backendUrlWihoutApiEndpoint } from "../../../../../utils/backendConfig";
import "./style.css";
import { audioDurationExtractor } from "../../../../../utils/audioDurationExtractor";
import { BsTrashFill } from "react-icons/bs";
export default function RecordedAudioDisplayer({
  content,
  flag = false,
  setFile,
}: {
  content: string;
  flag?: boolean;
  setFile?: Dispatch<SetStateAction<File | null>>;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState("");
  useEffect(() => {
    async function load() {
      const res = await audioDurationExtractor(
        flag
          ? content
          : `${backendUrlWihoutApiEndpoint}/resources/chats/${content}`
      );
      setDuration(res);
    }

    load();
    return () => {
      if (flag) URL.revokeObjectURL(content);
    };
  }, []);
  return (
    <div className="flex items-center rounded-md bg-teal-950 px-5">
      {/* <BsTrashFill
        className="text-red-500  cursor-pointer"
        size={20}
        onClick={() => setFile(null)}
      /> */}
      <div className="relative ">
        <audio
          ref={ref}
          id="au"
          className=""
          controlsList="nodownload"
          controls
        >
          <source
            src={
              flag
                ? content
                : `${backendUrlWihoutApiEndpoint}/resources/chats/${content}`
            }
          />
          not supported
        </audio>
        <small
          style={{ top: "50%", transform: "translateY(-50%)" }}
          className="absolute right-0 lg:right-3 "
        >
          {duration}
        </small>
      </div>
    </div>
  );
}
