import { Link, useLocation } from "react-router-dom";
import { BsChatTextFill, BsPeopleFill } from "react-icons/bs";
import { IoSettings } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../../redux/store/store";
import { logout } from "../../../redux/features/user/userSlice";
import socket from "../../../service/socket";
import { tempCatPhoto } from "../../../assets/temporaryProfilePhoto";
import { API_BASE_URL } from "../../../service/api-setup";

export default function SideNavigationMenu() {
  const dispatch = useDispatch<StoreDispatch>();
  const profilePhoto = useSelector(
    (state: RootState) => state.authSlice.profilePhoto
  );
  const location = useLocation();
  return (
    <aside className=" py-2 px-2 border-slate-100 dark:border-zinc-950  border-r-8  text-zinc-900 dark:text-lime-500  ">
      <Link to={"/"}>
        <h1 className="  bg-clip-text     font-bold mb-3 "> MyChat</h1>
      </Link>
      <ul className="flex  flex-col  items-center gap-5  ">
        <li>
          <Link to={"/profile?history=" + location.pathname}>
            <div className={` w-12 h-12 avatar `}>
              <img
                className="rounded-full  w-full    "
                src={
                  profilePhoto.path
                    ? `${API_BASE_URL}/resources/profiles/${profilePhoto.path}`
                    : tempCatPhoto
                }
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
            onClick={() => {
              dispatch(logout());
              socket.disconnect();
            }}
            className=" accent-dark-btn "
          >
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}
