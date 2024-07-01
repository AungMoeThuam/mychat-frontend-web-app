import { useEffect, useRef } from "react";

export default function VideoPlayer({
  src,
  type = "video/mp4",
}: {
  src: string;
  type?: string;
}) {
  async function getVideo() {
    const res = await fetch(src, {
      headers: {
        "Content-Encoding": "gzip",
      },
    });
    const a = await res.blob();
    let c = URL.createObjectURL(a);
    if (ref && ref.current) ref.current.src = c;
  }

  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    getVideo();
    // if (ref.current) {
    //   ref.current.pause();
    //   ref.current.removeAttribute("src");
    //   ref.current.load();
    // }
    console.log("rerender - video ");
  }, [src]);

  return (
    <video
      poster="https://th-thumbnailer.cdn-si-edu.com/ii_ZQzqzZgBKT6z9DVNhfPhZe5g=/fit-in/1600x0/filters:focal(1061x707:1062x708)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer_public/55/95/55958815-3a8a-4032-ac7a-ff8c8ec8898a/gettyimages-1067956982.jpg"
      // onBlur={(e) => e.currentTarget.pause()}
      ref={ref}
      className=" w-48 lg:w-64 rounded-lg"
      controls
      controlsList="nodownload"
      preload="auto"
    ></video>
  );
}
