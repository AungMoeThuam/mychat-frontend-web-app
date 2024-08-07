import { useEffect, useRef, useState } from "react";
import socket from "../../../service/socket.service";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { IoPersonCircle } from "react-icons/io5";
import { BsMicFill, BsMicMuteFill } from "react-icons/bs";
import sound from "../../../assets/audios/video-calling-sound.mp3";
import createWebRtc from "../../../lib/utils/rtcPeerConnection";
export default function AudioCallRoom() {
  const [callEndByCaller, setCallEndByCaller] = useState(false);
  const { friendId, calleeName } = useParams();
  const [isSDPReady, setIsSDPReady] = useState(false);
  const { currentUserId, username } = useSelector(
    (state: RootState) => state.authSlice
  );
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const localAudioStream = useRef<MediaStream | null>(new MediaStream());
  const remoteAudioStream = useRef<MediaStream | null>(new MediaStream());
  const soundRef = useRef<HTMLAudioElement>(null);
  const rtcPeerConnection = useRef<RTCPeerConnection>(createWebRtc());
  let timeoutId = useRef<any>();
  let timeoutId2 = useRef<any>();
  const [loading, setLoading] = useState(true);
  const [localAudio, setLocalAudio] = useState(true);
  function handup() {
    setLoading(false);
    socket.emitEvent("end-call", { targetUserId: friendId });
    localAudioStream.current?.getTracks().forEach((e) => e.stop());
    rtcPeerConnection.current?.close();
    window.close();
  }

  async function toggleLocalAudio() {
    if (localAudioStream.current) {
      let a = localAudioStream.current
        .getTracks()
        .find((e) => e.kind === "audio");
      if (a?.enabled) {
        a.enabled = false;
        setLocalAudio(false);
      } else {
        a!.enabled = true;
        setLocalAudio(true);
      }
    }
  }
  async function audioCallHandler() {
    setInterval(
      () => console.log(rtcPeerConnection.current.connectionState),
      5000
    );
    timeoutId2.current = setInterval(() => soundRef.current?.play(), 1000);
    rtcPeerConnection.current.ontrack = (e) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteAudioStream.current;
      }

      e.streams[0]
        .getTracks()
        .forEach((e) => remoteAudioStream.current?.addTrack(e));
    };

    rtcPeerConnection.current.onicecandidate = (e) => {
      if (e.candidate && isSDPReady !== true) {
        setIsSDPReady(true);
      }
    };

    rtcPeerConnection.current.oniceconnectionstatechange = () => {
      if (
        rtcPeerConnection.current?.iceConnectionState === "connected" ||
        rtcPeerConnection.current?.iceConnectionState === "completed"
      ) {
        setLoading(false);
        clearInterval(timeoutId2.current);
        console.log("Peers are connected");
      } else if (
        rtcPeerConnection.current?.iceConnectionState === "closed" ||
        rtcPeerConnection.current?.iceConnectionState === "disconnected"
      ) {
        handup();
        setLoading(false);
      }
    };

    localAudioStream.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    if (localAudioRef.current)
      localAudioRef.current.srcObject = localAudioStream.current;

    localAudioStream.current
      .getTracks()
      .forEach((e) =>
        rtcPeerConnection.current?.addTrack(e, localAudioStream.current!)
      );

    rtcPeerConnection.current
      .createOffer()
      .then((e) => rtcPeerConnection.current.setLocalDescription(e));
  }
  useEffect(() => {
    if (isSDPReady === true)
      socket.emitEvent("call", {
        callerName: username,
        calleeId: friendId,
        callerId: currentUserId,
        offer: rtcPeerConnection.current.localDescription,
        type: "audio",
      });
  }, [isSDPReady]);
  useEffect(() => {
    if (localAudioRef.current && remoteAudioRef.current) {
      localAudioRef.current.srcObject = localAudioStream.current;
      remoteAudioRef.current.srcObject = remoteAudioStream.current;
    }
  }, [loading, localAudio]);
  useEffect(() => {
    const answerHandler = async (data: any) => {
      const { answer } = data;
      const rtcSessionDescription = new RTCSessionDescription(answer);
      clearTimeout(timeoutId.current);
      clearTimeout(timeoutId2.current);
      await rtcPeerConnection.current?.setRemoteDescription(
        rtcSessionDescription
      );
    };

    const onEndCallEventHandler = () => {
      setTimeout(() => window.close(), 3000);
      setCallEndByCaller(true);
    };
    socket.subscribeOneEvent("end-call", onEndCallEventHandler);

    socket.subscribeOneEvent("answer", answerHandler);

    setTimeout(audioCallHandler, 2000);
    return () => {
      socket.unbSubcribeOneEvent("end-call", onEndCallEventHandler);
      socket.unbSubcribeOneEvent("answer", answerHandler);
    };
  }, []);
  return (
    <div className="  flex-1 w-dvw h-dvh flex flex-col  justify-center items-center dark:bg-zinc-900 ">
      <nav className=" bg-gradient-to-r flex justify-between  from-lime-500 to-teal-500 w-full text-zinc-950 px-4 py-2">
        {calleeName}
        <p>Audio Call</p>
      </nav>
      <div className="flex-1 flex flex-col justify-center  items-center">
        {callEndByCaller && (
          <h1>Call Has Ended! This window will be closed in 3s!</h1>
        )}
        {loading && <audio src={sound} ref={soundRef} />}
        {loading && !callEndByCaller ? (
          <h1>calling...</h1>
        ) : (
          <>
            <IoPersonCircle size={200} />
            <h1>{calleeName} </h1>
            <TimeDuration />
            <audio
              ref={localAudioRef}
              className=" w-40 h-40 border-8"
              autoPlay
            ></audio>
            <audio
              ref={remoteAudioRef}
              className=" w-40 h-40 border-8"
              autoPlay
            ></audio>
          </>
        )}
      </div>
      <footer className="flex gap-5  justify-center bg-gradient-to-r  from-lime-500 to-teal-500 w-full text-zinc-950 py-1 ">
        <button
          onClick={handup}
          className=" bg-red-500 btn border-none  text-white"
        >
          End call
        </button>
        <button
          onClick={toggleLocalAudio}
          className="bg-zinc-950 text-lime-500 btn border-none"
        >
          {localAudio ? <BsMicFill size={20} /> : <BsMicMuteFill size={20} />}
        </button>
      </footer>
    </div>
  );
}

function TimeDuration() {
  const [time, setTime] = useState(0);
  useEffect(() => {
    let a = setInterval(() => setTime((prev) => (prev += 1)), 1000);
    return () => {
      clearInterval(a);
    };
  }, [time]);
  return <p> {formTime(time)} </p>;
}

function formTime(time: number) {
  console.log(time < 60);
  console.log(time);

  if (time < 60) return time + " s";
  else return Math.trunc(time / 60) + " m : " + (time % 60) + " s";
}
