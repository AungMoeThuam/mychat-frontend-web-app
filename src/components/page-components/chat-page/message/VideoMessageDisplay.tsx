import { useRef } from "react";
import { backendUrlWihoutApiEndpoint } from "../../../../utils/backendConfig";

export default function VideoMessageDisplay(props: {
  content: string;
  type: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const { content } = props;
  return (
    <>
      <video
        poster="https://th-thumbnailer.cdn-si-edu.com/ii_ZQzqzZgBKT6z9DVNhfPhZe5g=/fit-in/1600x0/filters:focal(1061x707:1062x708)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer_public/55/95/55958815-3a8a-4032-ac7a-ff8c8ec8898a/gettyimages-1067956982.jpg"
        onBlur={(e) => {
          e.currentTarget.pause();
        }}
        ref={ref}
        className=" w-48 lg:w-64 rounded-lg"
        controlsList="nodownload"
        preload="none"
        controls
      >
        <source
          src={`${backendUrlWihoutApiEndpoint}/resources/chats/${content}`}
        />
      </video>
    </>
  );
}
