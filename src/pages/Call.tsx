import { RefObject, useEffect, useRef, useState } from "react";
import socket from "../service/socket";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../redux/store/store";
import { FaVideo } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { FaPhoneFlip } from "react-icons/fa6";
import { minimizeCallWindow } from "../redux/features/call/callSlice";

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

interface CallPageProps {
  userStream: MediaStream | null;
  myref: RefObject<HTMLVideoElement>;
}

function CallPage({ userStream, myref }: CallPageProps) {
  const { friendId } = useParams();
  const userId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );
  const dispatch = useDispatch<StoreDispatch>();
  const [videoCall, setVideoCall] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCallAcceptedByCallee, setIsCallAcceptedByCallee] = useState(false);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  let remoteStream = useRef<MediaStream | null>(null);
  let videoStream = useRef<MediaStream | null>(null);
  const rtcPeerConnection = useRef<null | RTCPeerConnection>(null);
  async function handup() {
    setVideoCall(false);
    videoStream.current?.getTracks().forEach((e) => e.stop());
    rtcPeerConnection.current?.close();
    videoRef.current!.srcObject = null;
    videoRef.current?.pause();
  }
  let callId: any = 0;
  async function videoCallHandler() {
    // callId = setTimeout(handup, 10000);
    setLoading(true);
    setVideoCall(true);
    userStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    remoteStream.current = new MediaStream();

    if (videoRef.current) {
      videoRef.current.srcObject = userStream;
      //   videoRef.current.srcObject = videoStream.current;
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
        setIsCallAcceptedByCallee(true);

        console.log("Peers are connected");
      } else if (
        rtcPeerConnection.current?.iceConnectionState === "closed" ||
        rtcPeerConnection.current?.iceConnectionState === "disconnected"
      ) {
        videoStream.current?.getTracks().forEach((track) => track.stop());
        rtcPeerConnection.current.close();
        setVideoCall(false);
        setLoading(false);
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
      }
    };
    videoStream.current
      ?.getTracks()
      .forEach((e) =>
        rtcPeerConnection.current?.addTrack(e, videoStream.current!)
      );

    const offer = await rtcPeerConnection.current.createOffer();
    await rtcPeerConnection.current?.setLocalDescription(offer);
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
    if (videoRef.current && remoteRef.current) {
      videoRef.current.srcObject = videoStream.current;
      remoteRef.current.srcObject = remoteStream.current;
    }
  }, [isCallAcceptedByCallee]);
  useEffect(() => {
    console.log(" my fef is ", myref);
    videoCallHandler();
    const answerHandler = async ({ answer }: { answer: any }) => {
      await rtcPeerConnection.current?.setRemoteDescription(answer);
      clearTimeout(callId);
    };
    const exchangeCandidateHandler = async ({ sdp }: { sdp: any }) => {
      rtcPeerConnection.current?.addIceCandidate(sdp);
    };
    socket.subscribeOneEvent("exchange-candidate", exchangeCandidateHandler);

    socket.subscribeOneEvent("answer", answerHandler);

    return () => {
      console.log(" user stream ", userStream);
      socket.unbSubcribeOneEvent("answer", answerHandler);
      socket.unbSubcribeOneEvent(
        "exchange-candidate",
        exchangeCandidateHandler
      );
    };
  }, []);

  return (
    <div className="  flex-1 h-dvh flex flex-col  justify-center items-center ">
      <main className="flex-1 flex flex-col justify-center  bg-zinc-200 items-center">
        {videoCall ? (
          isCallAcceptedByCallee ? (
            <div className=" relative w-full flex-1 flex justify-center ">
              <video
                style={{ width: "80dvw", height: "80dvh" }}
                className="  "
                ref={remoteRef}
                autoPlay
                muted
              ></video>
              <video
                className=" absolute z-50 top-1/3 right-1  w-60 h-36  border"
                ref={videoRef}
                autoPlay
              ></video>
            </div>
          ) : (
            <video
              style={{ width: "80dvw", height: "80dvh" }}
              className="  border border-red-400"
              ref={videoRef}
              autoPlay
              muted
            ></video>
          )
        ) : (
          <IoPersonCircle size={300} />
        )}

        {loading ? (
          <>
            {!isCallAcceptedByCallee && <h1>calling....</h1>}
            {/* <audio ref={audioRef}></audio> */}
          </>
        ) : (
          <h1>Press button to start calling! </h1>
        )}
      </main>
      <footer className="flex gap-5  justify-center bg-gradient-to-r  from-lime-500 to-teal-500 w-full text-zinc-950 py-1 ">
        {loading && !videoCall ? (
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
            // onClick={voiceCallHandler}
            className=" bg-zinc-950 text-lime-500 px-3 py-2 rounded-md"
          >
            <FaPhoneFlip size={24} />
          </button>
        )}
        {videoCall ? (
          <button
            // onClick={handup}
            className=" bg-red-600 text-white px-3 py-2 rounded-md"
          >
            End Call
          </button>
        ) : (
          <button
            // onClick={videoCallHandler}
            className=" bg-zinc-950 text-lime-500 px-3 py-2 rounded-md"
          >
            <FaVideo size={24} />
          </button>
        )}
        <button
          // onClick={videoCallHandler}
          onClick={() => dispatch(minimizeCallWindow())}
          className=" bg-zinc-950 text-lime-500 px-3 py-2 rounded-md"
        >
          Minimize
        </button>
      </footer>
    </div>
  );
}

export default CallPage;
