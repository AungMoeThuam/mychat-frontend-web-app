import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { IoIosMic, IoIosMicOff } from "react-icons/io";
import socket from "../../../service/socket";

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

export default function VideoCallRoom() {
  let offer = localStorage.getItem("offer");

  const { callerId, calleeId } = useParams();

  const [remoteVideo, setRemoteVideo] = useState(true);
  const [localVideo, setLocalVideo] = useState(true);
  const [localMic, setLocalMic] = useState(true);

  const [loading, setLoading] = useState(true);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  let remoteStream = useRef<MediaStream | null>(new MediaStream());
  let videoStream = useRef<MediaStream | null>(new MediaStream());

  const rtcPeerConnection = useRef<null | RTCPeerConnection>(null);
  async function handup() {
    videoStream.current?.getTracks().forEach((e) => e.stop());
    rtcPeerConnection.current?.close();
    videoRef.current?.pause();
    window.close();
  }

  async function toggleAudio() {
    if (videoStream.current) {
      let as = videoStream.current.getTracks().find((e) => e.kind === "audio");

      if (as?.enabled) {
        as.enabled = false;
        setLocalMic(false);
      } else {
        as!.enabled = true;
        setLocalMic(true);
      }
    }
  }
  async function toggleLocalVideo() {
    if (videoStream.current) {
      let vs = videoStream.current.getTracks().find((e) => e.kind === "video");
      if (localVideo) {
        vs!.stop();

        setLocalVideo(false);
        socket.emitEvent("turn-off-video", { targetUserId: callerId });
      } else {
        videoStream.current = new MediaStream();
        videoStream.current = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        videoStream.current.getTracks().forEach((t) =>
          rtcPeerConnection.current?.getSenders().forEach((e) => {
            console.log(" track ", e.track?.kind);

            if (e.track?.kind === t.kind) e.replaceTrack(t);
          })
        );
        setLocalVideo(true);
        socket.emitEvent("turn-on-video", { targetUserId: callerId });
      }
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

    rtcPeerConnection.current = createWebRtc();

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
      console.log(" remote track in accept page ", e.track);
      if (remoteRef.current) {
        remoteRef.current.srcObject = remoteStream.current;
      }
      e.streams[0].getTracks().forEach((e) => {
        remoteStream.current?.addTrack(e);
      });
    };

    rtcPeerConnection.current.onicecandidate = (e) => {
      console.log("ice candidate have been triggered! ");

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
      <main className="flex-1 flex flex-col justify-center  items-center">
        {loading ? (
          <h1>loading...</h1>
        ) : (
          <div className=" relative w-full flex-1 flex justify-center ">
            <video
              className={remoteVideo ? " " : "hidden"}
              style={{ width: "80dvw", height: "80dvh" }}
              ref={remoteRef}
              autoPlay
            ></video>
            <video
              style={!remoteVideo ? { width: "80dvw", height: "80dvh" } : {}}
              className={
                remoteVideo ? " absolute z-50  top-5 right-5  w-60 h-36  " : ""
              }
              ref={videoRef}
              autoPlay
            ></video>
          </div>
        )}
      </main>
      <footer className="flex gap-5  justify-center bg-gradient-to-r  from-lime-500 to-teal-500 w-full text-zinc-950 py-1 ">
        <button
          onClick={handup}
          className=" bg-red-600 text-white px-3 py-2 rounded-md"
        >
          End Call
        </button>

        <button
          onClick={toggleAudio}
          className=" bg-zinc-950 text-lime-500 px-3 py-2 rounded-md"
        >
          {localMic ? <IoIosMic size={24} /> : <IoIosMicOff size={24} />}
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