import { Link, useLocation } from "react-router-dom";
import { backendUrlWihoutApiEndpoint } from "../../../utils/backendConfig";
import { BsChatTextFill, BsPeopleFill } from "react-icons/bs";
import { IoSettings } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../../redux/store/store";
import { logout } from "../../../redux/features/user/userSlice";
import socket from "../../../service/socket";
import { tempCatPhoto } from "../../../assets/temporaryProfilePhoto";

export default function SideNavigationMenu() {
  const dispatch = useDispatch<StoreDispatch>();
  const profilePhoto = useSelector(
    (state: RootState) => state.authSlice.profilePhoto
  );
  const location = useLocation();
  return (
    <aside style={{ borderRight: `3px solid #0a0a0a` }} className=" py-2 px-2 ">
      <Link to={"/"}>
        <h1 className="  bg-clip-text text-transparent bg-gradient-to-r from-lime-500 to-teal-500   font-bold mb-3 "> MyChat</h1>
      </Link>
      <ul className="flex  flex-col  items-center gap-5  text-lime-500">
        <li>
          <Link to={"/profile?history=" + location.pathname}>
            <div className={` w-12 h-12 avatar `}>
              <img
                className="rounded-full  w-full    "
                src={
                  profilePhoto.path
                    ? `${backendUrlWihoutApiEndpoint}/resources/profiles/${profilePhoto.path}`
                    : tempCatPhoto
                }
              />
            </div>
          </Link>
        </li>
        <li>
          <Link to={"/"} >
            <BsChatTextFill  size={20} />
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
            className=" btn btn-sm text-zinc-900 bg-gradient-to-r from-lime-500 to-teal-500 "
          >
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}
