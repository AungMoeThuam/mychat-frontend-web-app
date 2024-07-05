import { useEffect, useState } from "react";
import { FaStopCircle } from "react-icons/fa";
import { ImCross } from "react-icons/im";

export default function VoiceRecorder({
  stopRecording,
  removeFile,
}: {
  stopRecording: () => any;
  removeFile: () => void;
}) {
  const [time, setTime] = useState(0);
  useEffect(() => {
    let intervalId = setInterval(
      () =>
        setTime((prev) => {
          return prev + 1000;
        }),
      1000
    );
    if (time === 60000) stopRecording();

    return () => {
      clearInterval(intervalId);
    };
  }, [time]);
  return (
    <div className=" flex-1 mx-20   bg-zinc-950 dark:bg-lime-500 rounded-lg flex items-center  justify-between">
      <div className="flex-1 flex items-center  gap-2 pr-2 py-1">
        <ImCross
          onClick={removeFile}
          size={20}
          className=" text-zinc-950 p-1 ml-2 bg-lime-500 dark:bg-zinc-950 dark:text-lime-500 cursor-pointer  rounded-full "
        />

        <progress
          className="progress  progress-success   flex-1 h-6 bg-slate-200 dark:bg-zinc-900"
          value={time}
          max={60000}
        ></progress>
        <small className=" text-lime-500 dark:text-zinc-950  font-bold">
          {Math.round(time / 1000)} s
        </small>
      </div>

      <FaStopCircle
        className=" text-lime-500 dark:text-zinc-950 mr-2  rounded-full cursor-pointer "
        size={25}
        onClick={stopRecording}
      />
    </div>
  );
}
