import { useEffect, useMemo, useRef, useState } from "react";
import socket from "../service/socket";
import { useParams } from "react-router-dom";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
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

export default function CallAcceptedPage() {
  let offer = localStorage.getItem("offer");

  const { callerId, calleeId } = useParams();

  const [remoteVideo, setRemoteVideo] = useState(true);
  const [localVideo, setLocalVideo] = useState(true);

  const [loading, setLoading] = useState(true);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  let remoteStream = useRef<MediaStream | null>(null);
  let videoStream = useRef<MediaStream | null>(null);

  const rtcPeerConnection = useRef<null | RTCPeerConnection>(null);
  async function handup() {
    videoStream.current?.getTracks().forEach((e) => e.stop());
    rtcPeerConnection.current?.close();
    videoRef.current?.pause();
    window.close();
  }

  async function toggleLocalVideo() {
    if (localVideo === true) {
      setLocalVideo(false);
      videoRef.current?.pause();
      videoStream.current?.getTracks().forEach((e) => e.stop());
      if (rtcPeerConnection.current)
        rtcPeerConnection.current
          .getSenders()
          .forEach((e) => rtcPeerConnection.current?.removeTrack(e));
      socket.emitEvent("turn-off-video", { targetUserId: callerId });
    } else {
      setLocalVideo(true);
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
      socket.emitEvent("turn-on-video", { targetUserId: callerId });
    }
  }

  async function answerCall() {
    videoStream.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = videoStream.current;
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
    }

    remoteStream.current = new MediaStream();
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

    rtcPeerConnection.current.oniceconnectionstatechange = () => {
      console.log(
        `ICE connection state: ${rtcPeerConnection.current?.iceConnectionState}`
      );
      if (
        rtcPeerConnection.current?.iceConnectionState === "connected" ||
        rtcPeerConnection.current?.iceConnectionState === "completed"
      ) {
        setLoading(false);
        console.log("Peers are connected");
      } else if (
        rtcPeerConnection.current?.iceConnectionState === "closed" ||
        rtcPeerConnection.current?.iceConnectionState === "disconnected"
      ) {
        handup();
      }
    };

    rtcPeerConnection.current.ontrack = (e) => {
      console.log(" remote track ", e.track);
      if (remoteRef.current) {
        remoteRef.current.srcObject = remoteStream.current;
      }
      e.streams[0].getTracks().forEach((e) => {
        remoteStream.current?.addTrack(e);
      });
    };

    rtcPeerConnection.current.onicecandidate = (e) => {
      if (!e.candidate) {
        let answer = rtcPeerConnection.current?.localDescription;
        socket.emitEvent("answer", { callerId, calleeId, answer });
      }
    };
    videoStream.current
      ?.getTracks()
      .forEach((e) =>
        rtcPeerConnection.current?.addTrack(e, videoStream.current!)
      );

    if (offer)
      await rtcPeerConnection.current.setRemoteDescription(JSON.parse(offer));

    let answer = await rtcPeerConnection.current.createAnswer();
    await rtcPeerConnection.current.setLocalDescription(answer);
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
  }, [loading, remoteVideo, localVideo]);
  useEffect(() => {
    let a = setTimeout(answerCall, 3000);

    const onTurnOffVideoHandler = () => setRemoteVideo(false);
    const onTurnOnVideoHandler = () => setRemoteVideo(true);

    socket.subscribeOneEvent("turn-off-video", onTurnOffVideoHandler);
    socket.subscribeOneEvent("turn-on-video", onTurnOnVideoHandler);
    return () => {
      socket.unbSubcribeOneEvent("turn-off-video", onTurnOffVideoHandler);
      socket.unbSubcribeOneEvent("turn-on-video", onTurnOnVideoHandler);
      clearTimeout(a);
    };
  }, []);

  return (
    <div className="  flex-1 h-dvh flex flex-col  justify-center items-center ">
      <nav className=" bg-gradient-to-r  from-lime-500 to-teal-500 w-full text-zinc-950 px-4 py-2">
        Aung Moe Thu -
      </nav>
      <main className="flex-1 flex flex-col justify-center  bg-zinc-200 items-center">
        <div className=" relative w-full flex-1 flex justify-center ">
          <video
            style={{ width: "80dvw", height: "80dvh" }}
            className=" border border-red-400 "
            ref={remoteRef}
            autoPlay
          ></video>

          {localVideo && (
            <video
              style={!remoteVideo ? { width: "80dvw", height: "80dvh" } : {}}
              className={
                remoteVideo
                  ? " absolute z-50  top-5 right-5  w-60 h-36  border"
                  : ""
              }
              ref={videoRef}
              autoPlay
            ></video>
          )}
        </div>
      </main>
      <footer className="flex gap-5  justify-center bg-gradient-to-r  from-lime-500 to-teal-500 w-full text-zinc-950 py-1 ">
        <button
          onClick={handup}
          className=" bg-red-600 text-white px-3 py-2 rounded-md"
        >
          End Call
        </button>

        <button
          onClick={voiceCallHandler}
          className=" bg-zinc-950 text-lime-500 px-3 py-2 rounded-md"
        >
          <FaPhoneFlip size={24} />
        </button>
        <button
          onClick={toggleLocalVideo}
          className=" bg-zinc-950 text-lime-500 px-3 py-2 rounded-md"
        >
          {localVideo ? <FaVideo /> : <FaVideoSlash />}
        </button>
      </footer>
    </div>
  );
}
