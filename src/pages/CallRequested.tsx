import { useEffect, useId, useRef, useState } from "react";
import socket from "../service/socket";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { FaVideo } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { FaPhoneFlip } from "react-icons/fa6";

export function createWebRtc(): RTCPeerConnection {
  const rtcPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
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

export default function CallRequestedPage() {
  const { friendId } = useParams();
  const userId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );
  const [videoCall, setVideoCall] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, settext] = useState("");
  const remoteRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  let remoteStream = useRef<MediaStream | null>(null);
  let videoStream = useRef<MediaStream | null>(null);
  const rtcPeerConnection = useRef<null | RTCPeerConnection>(null);
  async function videoCallHandler() {
    setVideoCall(true);
    videoStream.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    remoteStream.current = new MediaStream();

    if (videoRef.current) {
      videoRef.current.srcObject = videoStream.current;
    }
    rtcPeerConnection.current = new RTCPeerConnection({
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

    rtcPeerConnection.current.ontrack = (e) => {
      console.log(" remote track is ", e.streams[0]);
      if (remoteRef.current) {
        remoteRef.current.srcObject = remoteStream.current;
      }
      e.streams[0].getTracks().forEach((e) => {
        remoteStream.current?.addTrack(e);
      });
    };
    rtcPeerConnection.current.oniceconnectionstatechange = () => {
      console.log(
        `ICE connection state: ${rtcPeerConnection.current?.iceConnectionState}`
      );
      if (
        rtcPeerConnection.current?.iceConnectionState === "connected" ||
        rtcPeerConnection.current?.iceConnectionState === "completed"
      ) {
        console.log("Peers are connected");
      }
    };
    rtcPeerConnection.current.onicecandidate = async (e) => {
      console.log(" offer candidate teat ", e.candidate);

      if (!e.candidate) {
        let offer = rtcPeerConnection.current?.localDescription;
        socket.emitEvent("call", {
          callerId: userId,
          calleeId: friendId,
          offer,
        });

        // socket.emitEvent("exchange-candidate", {
        //   targetUserId: friendId,
        //   sdp: offer,
        // });
      }
    };
    videoStream.current
      ?.getTracks()
      .forEach((e) =>
        rtcPeerConnection.current?.addTrack(e, videoStream.current!)
      );

    const offer = await rtcPeerConnection.current.createOffer();
    await rtcPeerConnection.current?.setLocalDescription(offer);
    // socket.emitEvent("call", { callerId: userId, calleeId: friendId, offer });
  }

  async function voiceCallHandler() {
    setLoading(true);
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    if (audioRef.current) {
      audioRef.current.srcObject = audioStream;
      audioRef.current.play();
    }
  }
  useEffect(() => {
    const answerHandler = async ({ callerId, calleeId, answer }) => {
      console.log("answer ", answer);
      settext("call is accpeted!");

      await rtcPeerConnection.current?.setRemoteDescription(answer);
    };
    const exchangeCandidateHandler = async ({ sdp }) => {
      rtcPeerConnection.current?.addIceCandidate(sdp);
    };
    socket.subscribeOneEvent("exchange-candidate", exchangeCandidateHandler);

    socket.subscribeOneEvent("answer", answerHandler);

    return () => {
      socket.unbSubcribeOneEvent("answer", answerHandler);
      socket.unbSubcribeOneEvent(
        "exchange-candidate",
        exchangeCandidateHandler
      );
    };
  }, []);

  return (
    <div className="flex flex-col  justify-center items-center h-screen">
      <nav className=" bg-gradient-to-r  from-lime-500 to-teal-500 w-full text-zinc-950 px-4 py-3">
        Aung Moe Thu - {text}
      </nav>
      <main className=" flex-1 flex flex-col justify-center items-center">
        {/* <video src="" className=" border w-screen"></video> */}
        {videoCall ? (
          <>
            <video
              className=" w-full  border"
              ref={videoRef}
              controls
              autoPlay
            ></video>
            <h1>above is me</h1>
            <video
              className="w-full border"
              ref={remoteRef}
              controls
              autoPlay
            ></video>
          </>
        ) : (
          <IoPersonCircle size={300} />
        )}

        {loading ? (
          <>
            {" "}
            <h1>calling....</h1>
            <audio ref={audioRef}></audio>
          </>
        ) : (
          <h1>Press button to start calling! </h1>
        )}
      </main>
      <footer className="flex gap-5  justify-center bg-gradient-to-r  from-lime-500 to-teal-500 w-full text-zinc-950 py-2 ">
        {loading ? (
          <button
            onClick={() => {
              setLoading(false);
            }}
            className=" bg-red-600 text-white px-3 py-2 rounded-md"
          >
            End Call
          </button>
        ) : (
          <button
            onClick={voiceCallHandler}
            className=" bg-zinc-950 text-lime-500 px-3 py-2 rounded-md"
          >
            <FaPhoneFlip size={24} />
          </button>
        )}
        {videoCall ? (
          <button
            onClick={() => {
              setVideoCall(false);
              videoRef.current.srcObject = null;
              videoRef.current?.pause();
              videoStream.current?.getTracks().forEach((e) => e.stop());
            }}
            className=" bg-red-600 text-white px-3 py-2 rounded-md"
          >
            End Call
          </button>
        ) : (
          <button
            onClick={videoCallHandler}
            className=" bg-zinc-950 text-lime-500 px-3 py-2 rounded-md"
          >
            <FaVideo size={24} />
          </button>
        )}
      </footer>
    </div>
  );
}
