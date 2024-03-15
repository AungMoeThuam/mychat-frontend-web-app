import { useEffect, useState } from "react";
import { FaStopCircle } from "react-icons/fa";
import { ImCross } from "react-icons/im";

export default function VoiceRecorderDipslay({
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
    <div className=" flex-1 mx-20   bg-teal-950 rounded-lg flex items-center  justify-between">
      <div className="flex-1 flex items-center gap-2 pr-2 py-1">
        <ImCross
          onClick={removeFile}
          size={20}
          className=" text-slate-950 bg-teal-500 p-1 cursor-pointer  rounded-full "
        />

        <progress
          className="progress   progress-success flex-1 h-6"
          value={time}
          max={60000}
        ></progress>
        <small>{Math.round(time / 1000)}s</small>
      </div>

      <FaStopCircle
        className="text-red-500 bg-white rounded-full cursor-pointer "
        size={25}
        onClick={stopRecording}
      />
    </div>
  );
}
