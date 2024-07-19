import { useEffect, useRef, useState } from "react";
import socket from "../service/socket";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { IoIosMic, IoIosMicOff } from "react-icons/io";
import sound from "./../assets/audios/video-calling-sound.mp3";

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
  const [localVideoOn, setLocalVideoOn] = useState(true);
  const [localAudioOn, setLocalAudioOn] = useState(true);
  const [remoteVideoOn, setRemoteVideoOn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isCallAcceptedByCallee, setIsCallAcceptedByCallee] = useState(false);
  const soundRef = useRef<HTMLAudioElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  let remoteStream = useRef<MediaStream | null>(null);
  let videoStream = useRef<MediaStream | null>(null);
  let timeoutId = useRef<any>();
  let timeoutId2 = useRef<any>();

  const rtcPeerConnection = useRef<null | RTCPeerConnection>(null);
  async function toggleAudio() {
    videoStream.current?.getAudioTracks().forEach((e) => e.stop());
  }
  async function toggleVideo() {
    if (localVideoOn === true) {
      setLocalVideoOn(false);
      videoRef.current?.pause();
      videoStream.current?.getTracks().forEach((e) => e.stop());
      if (rtcPeerConnection.current)
        rtcPeerConnection.current
          .getSenders()
          .forEach((e) => rtcPeerConnection.current?.removeTrack(e));
      socket.emitEvent("turn-off-video", { targetUserId: friendId });
    } else {
      setLocalVideoOn(true);
      videoStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      if (videoRef.current) videoRef.current.srcObject = videoStream.current;
      videoRef.current?.play();
      videoStream.current
        .getTracks()
        .forEach((a) =>
          rtcPeerConnection.current
            ?.getSenders()
            .forEach((e) => e.replaceTrack(a))
        );
      socket.emitEvent("turn-on-video", { targetUserId: friendId });
    }
  }
  function handup() {
    setLoading(false);
    videoStream.current?.getTracks().forEach((e) => e.stop());
    rtcPeerConnection.current?.close();
    videoRef.current?.pause();
    window.close();
  }
  async function videoCallHandler() {
    timeoutId.current = setTimeout(handup, 10000);
    timeoutId2.current = setInterval(() => soundRef.current?.play(), 1000);
    videoStream.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    remoteStream.current = new MediaStream();

    if (videoRef.current) {
      videoRef.current.srcObject = videoStream.current;
      videoRef.current.volume = 0;
      videoRef.current.muted = true;
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
        handup();
        setLoading(false);
      }
    };
    rtcPeerConnection.current.onicecandidate = async (e) => {
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
  }, [isCallAcceptedByCallee, remoteVideoOn]);
  useEffect(() => {
    let a = setTimeout(videoCallHandler, 2000);

    const answerHandler = async ({ answer }: { answer: any }) => {
      clearTimeout(timeoutId.current);
      clearTimeout(timeoutId2.current);
      await rtcPeerConnection.current?.setRemoteDescription(answer);
    };

    const onTurnOffVideoHandler = () => setRemoteVideoOn(false);
    const onTurnOnVideoHandler = () => setRemoteVideoOn(true);

    socket.subscribeOneEvent("turn-off-video", onTurnOffVideoHandler);
    socket.subscribeOneEvent("turn-on-video", onTurnOnVideoHandler);
    socket.subscribeOneEvent("answer", answerHandler);

    return () => {
      clearTimeout(a);
      socket.unbSubcribeOneEvent("turn-off-video", onTurnOffVideoHandler);
      socket.unbSubcribeOneEvent("turn-on-video", onTurnOnVideoHandler);
      socket.unbSubcribeOneEvent("answer", answerHandler);
    };
  }, []);

  return (
    <div className="  flex-1 w-dvw h-dvh flex flex-col  justify-center items-center dark:bg-zinc-900 ">
      <nav className=" bg-gradient-to-r  from-lime-500 to-teal-500 w-full text-zinc-950 px-4 py-2">
        Aung Moe Thu -
      </nav>
      <main className=" relative flex-1 flex flex-col justify-center w-full  items-center">
        {!isCallAcceptedByCallee && <audio src={sound} ref={soundRef}></audio>}
        {isCallAcceptedByCallee && (
          <div className=" relative w-full flex-1 flex justify-center items-center ">
            {remoteVideoOn && (
              <video
                style={{ width: "80dvw", height: "80dvh" }}
                ref={remoteRef}
                autoPlay
              ></video>
            )}
            {localVideoOn && (
              <video
                style={
                  !remoteVideoOn ? { width: "80dvw", height: "80dvh" } : {}
                }
                className={
                  !remoteVideoOn
                    ? ""
                    : " absolute z-50  top-5 right-5  w-60 h-36  border"
                }
                ref={videoRef}
                autoPlay
              ></video>
            )}
          </div>
        )}
        {!isCallAcceptedByCallee && (
          <video
            className=" absolute shadow-md  z-50  bottom-5 right-5  w-60 h-36  border-4 border-zinc-950 "
            ref={videoRef}
            autoPlay
          ></video>
        )}
        {loading && (
          <>
            {!isCallAcceptedByCallee && (
              <>
                <IoPersonCircle size={300} />
                <h1>calling....</h1>
              </>
            )}
          </>
        )}
      </main>
      <footer className="flex gap-5  justify-center bg-gradient-to-r  from-lime-500 to-teal-500 w-full text-zinc-950 py-1 ">
        {
          <button
            onClick={handup}
            className=" bg-red-600 text-white px-3 py-2 rounded-md"
          >
            End Call
          </button>
        }
        <button
          className={`${
            isCallAcceptedByCallee
              ? "bg-zinc-950 cursor-pointer"
              : "bg-zinc-600 opacity-30 cursor-default"
          } text-lime-500 px-3 py-2 rounded-md`}
        >
          {localAudioOn ? <IoIosMic size={24} /> : <IoIosMicOff size={24} />}
        </button>

        <button
          disabled={!isCallAcceptedByCallee}
          className={`${
            isCallAcceptedByCallee
              ? "bg-zinc-950 cursor-pointer"
              : "bg-zinc-600 opacity-30 cursor-default"
          } text-lime-500 px-3 py-2 rounded-md`}
          onClick={toggleVideo}
        >
          {localVideoOn ? <FaVideo /> : <FaVideoSlash />}
        </button>
      </footer>
    </div>
  );
}
