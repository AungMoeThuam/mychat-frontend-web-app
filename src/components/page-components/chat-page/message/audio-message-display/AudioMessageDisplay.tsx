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
    <div className="flex items-center rounded-md  px-5 bg-zinc-950 dark:bg-gradient-to-r  dark:from-lime-500 dark:to-teal-500">
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
                : 
                `${backendUrlWihoutApiEndpoint}/resources/chats/${content}`
            }
          />
          not supported
        </audio>
        <small
          style={{ top: "50%", transform: "translateY(-50%)" }}
          className="absolute right-0 lg:right-3 font-bold text-lime-500 dark:text-white"
        >
          {duration}
        </small>
      </div>
    </div>
  );
}
