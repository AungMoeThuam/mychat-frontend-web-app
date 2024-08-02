import AudioMessageDisplay from "./audio-message-display/AudioMessageDisplay";
import FileMessageDisplay from "./FileMessageDisplay";
import ImageMessageDisplay from "./ImageMessageDisplay";
import TextMessageDisplay from "./TextMessageDisplay";
import VideoMessageDisplay from "./VideoMessageDisplay";
function isFile(type: any) {
  const t = ["video", "image", "text", "audio"];
  return !t.includes(type.split("/")[0]);
}
interface MessageContentProps {
  type: string;
  content: string;
}
export default function MessageContent({ type, content }: MessageContentProps) {
  return (
    <>
      {type?.includes("audio") && <AudioMessageDisplay content={content} />}
      {type?.includes("image") && <ImageMessageDisplay content={content} />}
      {type?.includes("video") && <VideoMessageDisplay content={content} />}
      {type?.includes("text") && <TextMessageDisplay content={content} />}
      {isFile(type) && <FileMessageDisplay content={content} />}
    </>
  );
}
