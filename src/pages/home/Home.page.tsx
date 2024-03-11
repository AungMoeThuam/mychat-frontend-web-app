import { IoSettings } from "react-icons/io5";
import ConversationList from "../../components/conversation/ConversationList";
import "./style.css";
import { Link, Outlet, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { backendUrlWihoutApiEndpoint } from "../../utils/backendConfig";
import { RootState, StoreDispatch } from "../../redux/store/store";
import { BsChatTextFill, BsPeopleFill } from "react-icons/bs";
import { backgroundColor1 } from "../../utils/style";
import { useEffect } from "react";
import socket from "../../services/socket";
import { Event } from "../../utils/socketEvents";
import toast, { Toaster } from "react-hot-toast";
import { searchfriendNameThunk } from "../../redux/actions/searchFriendThunks";
import { updateSearchFriends } from "../../redux/slices/searchFriendSlice";
import { getFriendsListThunk } from "../../redux/actions/friendThunks";
export default function HomePage() {
  const [queryParams] = useSearchParams();
  const dispatch = useDispatch<StoreDispatch>();

  const profilePhoto = useSelector(
    (state: RootState) => state.authSlice.profilePhoto
  );
  const test = useSelector((state: RootState) => state.friendSlice.friendsList);
  console.log("friend list - ", test);
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
        dispatch(getFriendsListThunk());
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
      <aside
        style={{ borderRight: `3px solid #0a0a0a` }}
        className=" py-2 px-2"
      >
        <Link to={"/"}>
          <h1 className=" text-teal-500  font-bold mb-3"> MyChat</h1>
        </Link>
        <ul className="flex  flex-col  items-center gap-5 text-teal-500">
          <li>
            <Link to={"/profile"}>
              <div className={` w-12 h-12 avatar `}>
                <img
                  className="rounded-full  w-full    "
                  src={`${backendUrlWihoutApiEndpoint}/resources/profiles/${profilePhoto.path}`}
                />
              </div>
            </Link>
          </li>
          <li>
            <Link to={"/"}>
              <BsChatTextFill size={20} />
            </Link>
          </li>
          <li>
            <Link to={"/friends"}>
              <BsPeopleFill size={20} />
            </Link>
          </li>
          <li>
            <Link to={"/setting"}>
              <IoSettings size={20} />
            </Link>
          </li>
          <li>
            <button
              onClick={() => dispatch(logout())}
              className=" btn  btn-sm bg-slate-950"
            >
              Logout
            </button>
          </li>
        </ul>
      </aside>
      <section style={{ width: "20%" }} className="     ">
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
