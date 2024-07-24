import AudioCallRoom from "../components/page-components/call-requested-page/AudioCallRoom";
import VideoCallRoom from "../components/page-components/call-requested-page/VideoCallRoom";

export default function CallRequestedPage({
  callRoomType = "video",
}: {
  callRoomType?: string;
}) {
  if (callRoomType === "audio") return <AudioCallRoom />;

  return <VideoCallRoom />;
}
