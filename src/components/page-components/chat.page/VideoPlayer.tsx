import { useEffect, useRef } from "react";

export default function VideoPlayer({
  src,
  type = "video/mp4",
}: {
  src: string;
  type?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.pause();
      ref.current.removeAttribute("src");
      ref.current.load();
    }
  });
  return (
    <video
      onBlur={(e) => e.currentTarget.pause()}
      ref={ref}
      className=" w-48 lg:w-64 rounded-lg"
      controls
      muted
      controlsList="nodownload"
    >
      <source src={src} type={type}></source>
    </video>
  );
}
