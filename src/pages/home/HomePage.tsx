import "./style.css";
import { Outlet, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../redux/store/store";
import { useEffect, useMemo, useRef, useState } from "react";
import socket from "../../service/socket";
import { Event } from "../../utils/constants/socketEvents";
import toast, { Toaster } from "react-hot-toast";
import { searchfriendNameThunk } from "../../redux/features/people/peopleThunks";
import { updateSearchingPeopleResult } from "../../redux/features/people/peopleSlice";
import { fetchFriends } from "../../redux/features/friend/friendThunks";
import SideNavigationMenu from "../../components/share-components/side-navigation-menu/SideNavigationMenu";
import componentRenderInspector from "../../utils/test/componentRenderInspector";
import ConversationList from "../../components/page-components/home-page/conversation/ConversationList";
import Modal from "../../components/share-components/modal/Modal";
import { FaVideo } from "react-icons/fa";
import { createWebRtc } from "../CallRequested";

export default function HomePage() {
  const [queryParams] = useSearchParams();
  const dispatch = useDispatch<StoreDispatch>();
  const [call, setCall] = useState<string>("none");
  const rtcPeerConnection = useRef<null | RTCPeerConnection>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  let remoteStream = useRef<MediaStream | null>(null);
  let videoStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    function listenerForReject(data: any) {
      let search = queryParams.get("search");
      if (typeof data === "object") {
        dispatch(
          updateSearchingPeopleResult({
            requester: data.requesterId,
            receipent: data.receipentId,
            status: data.status,
          })
        );
        return;
      }
      dispatch(searchfriendNameThunk(search ? search : ""));
    }
    function listenerForRequest(data: any) {
      if (data === "acceptedByYou")
        toast("You have accepted a friend request!");
      else if (data === "acceptedByFriend") {
        dispatch(fetchFriends());
        toast("Your friend requst is accepted by him!");
      } else toast("Received a friend request!");
    }

    function callHandler(data) {
      const { callerId, calleeId, offer } = data;
      setCall("accept-call");
      console.log(data);

      toast((t) => (
        <span>
          Moe is calling ! <br></br>
          <button
            className=" bg-lime-500 text-black py-1 px-2 rounded-lg border-none "
            onClick={async () => {
              console.log("offer ", offer);

              videoStream.current = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
              });

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

              rtcPeerConnection.current.oniceconnectionstatechange = () => {
                console.log(
                  `ICE connection state: ${rtcPeerConnection.current?.iceConnectionState}`
                );
                if (
                  rtcPeerConnection.current?.iceConnectionState ===
                    "connected" ||
                  rtcPeerConnection.current?.iceConnectionState === "completed"
                ) {
                  console.log("Peers are connected");
                }
              };

              rtcPeerConnection.current.ontrack = (e) => {
                console.log("remote track in calleev ", e.streams[0]);

                if (remoteRef.current) {
                  remoteRef.current.srcObject = e.streams[0];
                }
                // e.streams[0].getTracks().forEach((track) => {
                //   // remoteStream.current = new MediaStream();
                //   remoteStream.current?.addTrack(track);
                // });
              };

              rtcPeerConnection.current.onicecandidate = (e) => {
                console.log(" icecandidate in callee ", e.candidate);

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

              await rtcPeerConnection.current.setRemoteDescription(offer);

              let answer = await rtcPeerConnection.current.createAnswer();
              await rtcPeerConnection.current.setLocalDescription(answer);
            }}
          >
            accept
          </button>
        </span>
      ));
    }

    const exchangeCandidateHandler = async ({ sdp }) => {
      rtcPeerConnection.current?.addIceCandidate(sdp);
    };
    socket.subscribeOneEvent("call", callHandler);
    socket.subscribeOneEvent("exchange-candidate", exchangeCandidateHandler);
    socket.subscribeOneEvent(Event.ACCEPT, listenerForRequest);
    socket.subscribeOneEvent(Event.REQUEST, listenerForRequest);
    socket.subscribeOneEvent(Event.REJECT, listenerForReject);

    let savedMode = localStorage.getItem("mode");
    if (savedMode)
      return document.body.querySelector("#root")?.classList.add("dark");

    return () => {
      socket.unbSubcribeOneEvent(Event.REQUEST, listenerForRequest);
      socket.unbSubcribeOneEvent(Event.ACCEPT, listenerForRequest);
      socket.unbSubcribeOneEvent(Event.REJECT, listenerForReject);
      socket.unbSubcribeOneEvent("call", callHandler);
    };
  }, []);
  function handup() {
    rtcPeerConnection.current?.close();
    videoStream.current?.getTracks().forEach((e) => e.stop());
  }
  componentRenderInspector("home");

  const memorize = useMemo(() => {
    console.log("render!");
    return (
      <div
        style={{
          height: "100dvh",
          width: "100dvw",
        }}
        className="flex dark:bg-zinc-900 bg-white"
      >
        <SideNavigationMenu />

        <section
          style={{ width: "20%" }}
          className=" border-r-8 border-slate-100 dark:border-zinc-950"
        >
          <ConversationList />
        </section>

        <main className=" flex-1">
          <Outlet />
        </main>
        <Toaster position="top-right" />
      </div>
    );
  }, []);

  return (
    <>
      {memorize}
      {(call == "minimize") === true && (
        <button className=" absolute z-50 bg-red-500 left-5 bottom-5 flex  justify-center items-center rounded-full w-16 h-16">
          <FaVideo size={25} />
        </button>
      )}
      {call === "accept-call" && (
        <Modal onClose={() => setCall("none")}>
          <div
            onClick={(e) => e.stopPropagation()}
            className=" flex flex-col justify-center "
          >
            <h1>Friend is calling !</h1>
            <video
              className=" w-96 h-96 border"
              ref={videoRef}
              controls
              autoPlay
            ></video>
            <video
              className=" w-96 h-96 border"
              ref={remoteRef}
              controls
              autoPlay
            ></video>
            <div className="flex">
              <button
                onClick={handup}
                className="bg-red-500 text-white px-3 py-2"
              >
                {" "}
                Hand up
              </button>
              <button
                onClick={() => {
                  setCall("minimize");
                }}
                className=" p-2 bg-lime-500 text-zinc-950"
              >
                minimize
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
