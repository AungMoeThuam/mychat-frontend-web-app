import {
  backendUrl,
  backendUrlWihoutApiEndpoint,
} from "../../../../utils/backendConfig";
import VideoPlayer from "../../chat-page/VideoPlayer";

export default function VideoMessageDisplay(props: {
  content: string;
  type: string;
}) {
  const { content, type } = props;
  return (
    <>
      <VideoPlayer
        type={type}
        src={`${backendUrlWihoutApiEndpoint}/resources/chats/${content}`}
      />
    </>
  );
}
