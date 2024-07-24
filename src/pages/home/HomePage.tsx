import "./style.css";
import { Outlet, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../redux/store/store";
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
import CallPage from "../Call";
import { endCall } from "../../redux/features/call/callSlice";

export default function HomePage() {
  const [queryParams] = useSearchParams();
  const dispatch = useDispatch<StoreDispatch>();
  const [call, setCall] = useState<string>("none");
  const rtcPeerConnection = useRef<null | RTCPeerConnection>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const aRef = useRef<HTMLVideoElement>(null);
  let remoteStream = useRef<MediaStream | null>(null);
  let videoStream = useRef<MediaStream | null>(null);
  const { isCallExist, minimize } = useSelector(
    (state: RootState) => state.callSlice
  );

  useEffect(() => {
    if (remoteRef.current && videoRef.current) {
      remoteRef.current.srcObject = remoteStream.current;
      videoRef.current.srcObject = videoStream.current;
    }
  }, [call]);

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

    function callHandler(data: any) {
      const { callerId, calleeId, offer } = data;
      setCall("accept-call");
      localStorage.setItem("offer", JSON.stringify(offer));
      toast((t) => (
        <span>
          Moe is calling ! <br></br>
          <button
            className=" bg-lime-500 text-black py-1 px-2 rounded-lg border-none "
            onClick={async () => {
              toast.remove(t.id);

              if (data.type === "video")
                window.open(
                  `/call-room-type=video:initiate=false/${callerId}/${calleeId}`,
                  "",
                  "popup"
                );
              else
                window.open(
                  `/call-room-type=audio:initiate=false/${callerId}/${calleeId}`,
                  "",
                  "popup"
                );
            }}
          >
            accept
          </button>
        </span>
      ));
    }

    socket.subscribeOneEvent("call", callHandler);
    socket.subscribeOneEvent(Event.ACCEPT, listenerForRequest);
    socket.subscribeOneEvent(Event.REQUEST, listenerForRequest);
    socket.subscribeOneEvent(Event.REJECT, listenerForReject);

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
    setCall("none");
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

  useEffect(() => {
    console.log(videoStream.current);
    if (aRef.current) aRef.current.srcObject = videoStream.current;
  }, [minimize, aRef]);
  return (
    <>
      {memorize}

      {isCallExist && (
        <Modal onClose={() => dispatch(endCall())}>
          <CallPage myref={videoRef} userStream={videoStream.current} />
        </Modal>
      )}
    </>
  );
}
