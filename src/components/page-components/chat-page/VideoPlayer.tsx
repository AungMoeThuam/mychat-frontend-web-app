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
    // <video
    //   playsInline
    //   onBlur={(e) => e.currentTarget.pause()}
    //   ref={ref}
    //   className=" w-48 lg:w-64 rounded-lg"
    //   controls
    //   muted
    //   controlsList="nodownload"
    
    // >
    //   <source src={src} type={type}></source>
    // </video>
    <video className=" w-48 lg:w-64 rounded-lg" ref={ref} src={src} preload="auto" controls playsInline>
      <source src={"http://localhost:4000/resources/chats/1719728681914.MOV"} />
      not supported 
    </video>
  );
}
