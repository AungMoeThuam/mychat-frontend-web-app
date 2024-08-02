import "./style.css";
import { Outlet, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../redux/store/store";
import { useEffect } from "react";
import socket from "../../service/socket.service";
import { Event } from "../../lib/utils/socketEvents";
import toast, { Toaster } from "react-hot-toast";
import { searchfriendNameThunk } from "../../redux/features/people/peopleThunks";
import { updateSearchingPeopleResult } from "../../redux/features/people/peopleSlice";
import { fetchFriends } from "../../redux/features/friend/friendThunks";
import SideNavigationMenu from "../../components/share-components/SideNavigationMenu";
import ConversationList from "../../components/page-components/home-page/conversation/ConversationList";

export default function HomePage() {
  const [queryParams] = useSearchParams();
  const dispatch = useDispatch<StoreDispatch>();

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
      const { callerId, calleeId, offer, callerName } = data;
      localStorage.setItem("offer", JSON.stringify(offer));
      toast((t) => (
        <span>
          {callerName} is calling ! <br></br>
          <button
            className=" bg-lime-500 text-black py-1 px-2 rounded-lg border-none "
            onClick={async () => {
              toast.remove(t.id);

              if (data.type === "video")
                window.open(
                  `/call-room-type=video:initiate=false/${callerId}/${calleeId}/${callerName}`,
                  "",
                  "popup"
                );
              else
                window.open(
                  `/call-room-type=audio:initiate=false/${callerId}/${calleeId}/${callerName}`,
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
}
