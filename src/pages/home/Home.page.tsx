import ConversationList from "../../components/page-components/home.page/conversation/ConversationList";
import "./style.css";
import { Outlet, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../redux/store/store";
import { backgroundColor1 } from "../../utils/style";
import { useEffect } from "react";
import socket from "../../services/socket";
import { Event } from "../../utils/socketEvents";
import toast, { Toaster } from "react-hot-toast";
import { searchfriendNameThunk } from "../../redux/actions/searchFriendThunks";
import { updateSearchFriends } from "../../redux/slices/searchFriendSlice";
import { getFriendsListAction } from "../../redux/actions/friendThunks";
import SideNavigationMenu from "../../components/page-components/home.page/side-navigation-menu/SideNavigationMenu";
export default function HomePage() {
  const [queryParams] = useSearchParams();
  const dispatch = useDispatch<StoreDispatch>();

  useEffect(() => {
    function listenerForReject(data: any) {
      let search = queryParams.get("search");
      if (typeof data === "object") {
        dispatch(
          updateSearchFriends({
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
        dispatch(getFriendsListAction());
        toast("Your friend requst is accepted by him!");
      } else toast("Received a friend request!");
    }
    socket.subscribeOneEvent(Event.ACCEPT, listenerForRequest);
    socket.subscribeOneEvent(Event.REQUEST, listenerForRequest);
    socket.subscribeOneEvent(Event.REJECT, listenerForReject);
    return () => {
      socket.unbSubcribeOneEvent(Event.REQUEST, listenerForRequest);
      socket.unbSubcribeOneEvent(Event.ACCEPT, listenerForRequest);
      socket.unbSubcribeOneEvent(Event.REJECT, listenerForReject);
    };
  }, []);
  return (
    <div
      style={{
        height: "100dvh",
        width: "100dvw",
        backgroundColor: backgroundColor1,
      }}
      className="flex"
    >
      <SideNavigationMenu />

      <section style={{ width: "20%" }}>
        <div
          style={{
            height: "8%",
            borderRight: "5px solid #0a0a0a",
          }}
          className=" p-2 "
        >
          <input
            className="input input-sm input-bordered w-full max-w-xs "
            placeholder="search..."
            type="search"
            name="search"
            id="search"
          />
        </div>
        <div
          style={{ height: "92%" }}
          className=" overflow-y-scroll px-2 py-2 "
          id="conversationList"
        >
          <ConversationList />
        </div>
      </section>

      <main className=" flex-1">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
