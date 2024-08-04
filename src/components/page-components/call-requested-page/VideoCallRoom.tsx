import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { IoIosMic, IoIosMicOff } from "react-icons/io";
import socket from "../../../service/socket.service";
import { RootState } from "../../../redux/store/store";
import sound from "../../../assets/audios/video-calling-sound.mp3";
import createWebRtc from "../../../lib/utils/rtcPeerConnection";

export default function VideoCallRoom() {
  const { friendId, calleeName } = useParams();
  const { currentUserId, username } = useSelector(
    (state: RootState) => state.authSlice
  );
  const [isSDPReady, setIsSDPReady] = useState(false);
  const [localVideoOn, setLocalVideoOn] = useState(true);
  const [localAudioOn, setLocalAudioOn] = useState(true);
  const [remoteVideoOn, setRemoteVideoOn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isCallAcceptedByCallee, setIsCallAcceptedByCallee] = useState(false);
  const soundRef = useRef<HTMLAudioElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rtcPeerConnection = useRef<RTCPeerConnection>(createWebRtc());
  const [callEndByCaller, setCallEndByCaller] = useState(false);

  let remoteStream = useRef<MediaStream | null>(new MediaStream());
  let videoStream = useRef<MediaStream | null>(new MediaStream());
  let timeoutId = useRef<any>();
  let timeoutId2 = useRef<any>();

  async function toggleAudio() {
    console.log(videoStream.current);
    if (videoStream.current) {
      let as = videoStream.current.getTracks().find((e) => e.kind === "audio")!;
      console.log(" as ", as);
      if (as?.enabled) {
        as.enabled = false;
        setLocalAudioOn(false);
      } else {
        as.enabled = true;
        setLocalAudioOn(true);
      }
    }
  }

  async function toggleVideo() {
    if (videoStream.current) {
      let vs = videoStream.current.getTracks().find((e) => e.kind === "video");
      if (localVideoOn) {
        vs!.stop();
        setLocalVideoOn(false);
        socket.emitEvent("turn-off-video", { targetUserId: friendId });
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
        videoStream.current.getTracks().forEach((t) =>
          rtcPeerConnection.current?.getSenders().forEach((e) => {
            if (e.track?.kind === t.kind) e.replaceTrack(t);
          })
        );
        // vs!.enabled = true;
        setLocalVideoOn(true);
        socket.emitEvent("turn-on-video", { targetUserId: friendId });
      }
    }
  }
  function handup() {
    setLoading(false);
    socket.emitEvent("end-call", { targetUserId: friendId });
    videoStream.current?.getTracks().forEach((e) => e.stop());
    rtcPeerConnection.current?.close();
    videoRef.current?.pause();
    window.close();
  }

  async function videoCallHandler() {
    timeoutId.current = setTimeout(handup, 30000);
    timeoutId2.current = setInterval(() => soundRef.current?.play(), 1000);
    videoStream.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = videoStream.current;
      videoRef.current.volume = 0;
      videoRef.current.muted = true;
    }

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
        clearTimeout(timeoutId.current);
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
      console.log("ice candidate have been triggered! ");
      if (e.candidate && isSDPReady !== true) {
        setIsSDPReady(true);
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

  useEffect(() => {
    if (isSDPReady === true)
      socket.emitEvent("call", {
        callerName: username,
        callerId: currentUserId,
        calleeId: friendId,
        offer: rtcPeerConnection.current.localDescription,
        type: "video",
      });
  }, [isSDPReady]);

  useEffect(() => {
    if (videoRef.current && remoteRef.current) {
      videoRef.current.srcObject = videoStream.current;
      remoteRef.current.srcObject = remoteStream.current;
    }
  }, [isCallAcceptedByCallee, remoteVideoOn, localVideoOn, loading]);
  useEffect(() => {
    let a = setTimeout(videoCallHandler, 2000);

    const answerHandler = async ({ answer }: { answer: any }) => {
      clearTimeout(timeoutId.current);
      clearTimeout(timeoutId2.current);
      await rtcPeerConnection.current?.setRemoteDescription(answer);
    };

    const onTurnOffVideoHandler = () => setRemoteVideoOn(false);
    const onTurnOnVideoHandler = () => setRemoteVideoOn(true);
    const onEndCallEventHandler = () => {
      setTimeout(() => window.close(), 3000);
      setCallEndByCaller(true);
    };
    socket.subscribeOneEvent("end-call", onEndCallEventHandler);
    socket.subscribeOneEvent("turn-off-video", onTurnOffVideoHandler);
    socket.subscribeOneEvent("turn-on-video", onTurnOnVideoHandler);
    socket.subscribeOneEvent("answer", answerHandler);

    return () => {
      clearTimeout(a);
      socket.unbSubcribeOneEvent("turn-off-video", onTurnOffVideoHandler);
      socket.unbSubcribeOneEvent("turn-on-video", onTurnOnVideoHandler);
      socket.unbSubcribeOneEvent("answer", answerHandler);
      socket.unbSubcribeOneEvent("end-call", onEndCallEventHandler);
    };
  }, []);

  return (
    <div className="  flex-1 w-dvw h-dvh flex flex-col  justify-center items-center dark:bg-zinc-900 ">
      <nav className=" bg-gradient-to-r  from-lime-500 to-teal-500 w-full text-zinc-950 px-4 py-2">
        {calleeName}
      </nav>
      <main className=" relative flex-1 flex flex-col justify-center w-full  items-center">
        {callEndByCaller && (
          <h1>Call has ended! This window will be closed in 3s</h1>
        )}
        {!isCallAcceptedByCallee && <audio src={sound} ref={soundRef}></audio>}
        {isCallAcceptedByCallee && !callEndByCaller && (
          <div className=" relative w-full flex-1 flex justify-center items-center ">
            <video
              style={{ width: "80dvw", height: "80dvh" }}
              ref={remoteRef}
              autoPlay
              className={remoteVideoOn ? "" : "hidden"}
            ></video>
            <video
              style={!remoteVideoOn ? { width: "80dvw", height: "80dvh" } : {}}
              className={
                !remoteVideoOn
                  ? ""
                  : " absolute z-50  top-5 right-5  w-60 h-36 "
              }
              ref={videoRef}
              autoPlay
            ></video>
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
          onClick={toggleAudio}
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
