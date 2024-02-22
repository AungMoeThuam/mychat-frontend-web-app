import { backendUrl } from "../../../utils/backendConfig";
import VideoPlayer from "../VideoPlayer";

export default function VideoMessageDisplay(props: { content: string }) {
  const { content } = props;
  return (
    <>
      <VideoPlayer src={`${backendUrl}/videoplay/${content}`} />
    </>
  );
}
