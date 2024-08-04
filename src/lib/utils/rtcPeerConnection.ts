export default function createWebRtc(): RTCPeerConnection {
  const rtcPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [import.meta.env.VITE_TESTING_STUN_SERVER_URL],
      },
      {
        urls: import.meta.env.VITE_TESTING_TURN_SERVER_URL,
        credential: import.meta.env.VITE_TESTING_TURN_SERVER_PASSWORD,
        username: import.meta.env.VITE_TESTING_TURN_SERVER_USERNAME,
      },
    ],
  });

  return rtcPeerConnection;
}
