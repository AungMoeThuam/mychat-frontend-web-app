import { useEffect, useRef, useState } from "react";
import { backendUrlWihoutApiEndpoint } from "../../../../../utils/backendConfig";
import "./style.css";
import { audioDurationExtractor } from "../../../../../utils/audioDurationExtractor";
export default function AudioMessageDisplay({
  content,
  flag = false,
}: {
  content: string;
  flag?: boolean;
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
    <div className="relative ">
      <audio ref={ref} id="au" className="" controlsList="nodownload" controls>
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
  );
}

/*
async function load() {
  const res = await fetch(
    `${backendUrlWihoutApiEndpoint}/resources/chats/${content}`,
    { method: "GET" }
  );
  const audio = await res.arrayBuffer();
  const c = new AudioContext();
  c.decodeAudioData(audio, function (buffer) {
    // Obtain the duration in seconds of the audio file (with milliseconds as well, a float value)
    var duration = buffer.duration;
    if (duration >= 60) setDuration(duration / 60);
    else setDuration(duration);
    // example 12.3234 seconds

    console.log("The duration of the song is of: " + duration + " seconds");
    // Alternatively, just display the integer value with
    // parseInt(duration)
    // 12 seconds
  });
}
*/
