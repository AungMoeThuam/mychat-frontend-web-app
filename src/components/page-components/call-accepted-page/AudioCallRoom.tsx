import { useEffect, useRef, useState } from "react";
import { createWebRtc } from "../../../pages/CallAccepted";
import socket from "../../../service/socket";
import { useParams } from "react-router-dom";

import { IoPersonCircle } from "react-icons/io5";
import { BsMicMuteFill } from "react-icons/bs";
import sound from "../../../assets/audios/video-calling-sound.mp3";
export default function AudioCallRoom() {
  const { callerId, calleeId } = useParams();
  const localAudioRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLVideoElement>(null);
  const localAudioStream = useRef<MediaStream | null>(new MediaStream());
  const remoteAudioStream = useRef<MediaStream | null>(new MediaStream());
  const soundRef = useRef<HTMLAudioElement>(null);
  const rtcPeerConnection = useRef<null | RTCPeerConnection>(null);
  let offer = localStorage.getItem("offer");

  const [loading, setLoading] = useState(true);
  function handup() {
    setLoading(false);
    localAudioStream.current?.getTracks().forEach((e) => e.stop());
    rtcPeerConnection.current?.close();
    window.close();
  }
  async function answerAudioCallHandler() {
    localAudioStream.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    if (localAudioRef.current)
      localAudioRef.current.srcObject = localAudioStream.current;
    rtcPeerConnection.current = createWebRtc();
    rtcPeerConnection.current.ontrack = (e) => {
      if (remoteAudioRef.current) {
        remoteAudioStream.current = e.streams[0];
        remoteAudioRef.current.srcObject = remoteAudioStream.current;
      }
    };
    rtcPeerConnection.current.onicecandidate = (e) => {
      if (!e.candidate) {
        let answer = rtcPeerConnection.current?.localDescription;
        socket.emitEvent("answer", {
          callerId,
          calleeId,
          answer,
          type: "audio",
        });
      }
    };
    rtcPeerConnection.current.oniceconnectionstatechange = () => {
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
        setLoading(false);
      }
    };
    localAudioStream.current
      .getAudioTracks()
      .forEach((e) => rtcPeerConnection.current?.addTrack(e));

    if (offer)
      await rtcPeerConnection.current.setRemoteDescription(JSON.parse(offer));

    const answer = await rtcPeerConnection.current.createAnswer();
    await rtcPeerConnection.current?.setLocalDescription(answer);
  }

  useEffect(() => {
    let a = setTimeout(answerAudioCallHandler, 3000);
    return () => {
      clearTimeout(a);
    };
  }, []);
  return (
    <div className="  flex-1 w-dvw h-dvh flex flex-col  justify-center items-center dark:bg-zinc-900 ">
      <nav className=" bg-gradient-to-r flex justify-between  from-lime-500 to-teal-500 w-full text-zinc-950 px-4 py-2">
        <h1>Username </h1>
        <p>Audio Call</p>
      </nav>
      <div className="flex-1 flex flex-col justify-center  items-center">
        {loading && <audio src={sound} ref={soundRef} />}
        {loading ? (
          <h1>loading...</h1>
        ) : (
          <>
            <IoPersonCircle size={200} />
            <h1>Aung Aung </h1>
            <TimeDuration />
            <video ref={localAudioRef} autoPlay></video>
            <video ref={remoteAudioRef} autoPlay></video>
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
        <button className="bg-zinc-950 text-lime-500 btn border-none">
          <BsMicMuteFill size={20} />
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
