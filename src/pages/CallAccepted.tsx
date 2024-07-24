import AudioCallRoom from "../components/page-components/call-accepted-page/AudioCallRoom";
import VideoCallRoom from "../components/page-components/call-accepted-page/VideoCallRoom";

export function createWebRtc(): RTCPeerConnection {
  const rtcPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302"],
      },
      {
        urls: "turn:numb.viagenie.ca",
        credential: "muazkh",
        username: "webrtc@live.com",
      },
    ],
  });

  return rtcPeerConnection;
}

export default function CallAcceptedPage({
  callRoomType = "video",
}: {
  callRoomType?: string;
}) {
  if (callRoomType === "audio") return <AudioCallRoom />;

  return <VideoCallRoom />;
}
