import "./style.css";
import { Outlet, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../redux/store/store";
import { backgroundColor1 } from "../../style/style";
import { useEffect } from "react";
import socket from "../../service/socket";
import { Event } from "../../utils/constants/socketEvents";
import toast, { Toaster } from "react-hot-toast";
import { searchfriendNameThunk } from "../../redux/features/people/peopleThunks";
import { updateSearchingPeopleResult } from "../../redux/features/people/peopleSlice";
import { fetchFriends } from "../../redux/features/friend/friendThunks";
import SideNavigationMenu from "../../components/share-components/side-navigation-menu/SideNavigationMenu";
import componentRenderInspector from "../../utils/test/componentRenderInspector";
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
    socket.subscribeOneEvent(Event.ACCEPT, listenerForRequest);
    socket.subscribeOneEvent(Event.REQUEST, listenerForRequest);
    socket.subscribeOneEvent(Event.REJECT, listenerForReject);
    return () => {
      socket.unbSubcribeOneEvent(Event.REQUEST, listenerForRequest);
      socket.unbSubcribeOneEvent(Event.ACCEPT, listenerForRequest);
      socket.unbSubcribeOneEvent(Event.REJECT, listenerForReject);
    };
  }, []);

  componentRenderInspector("home");

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
        <ConversationList />
      </section>

      <main className=" flex-1">
        <Outlet />
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
