import { useEffect, useRef } from "react";
import { ImCross } from "react-icons/im";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../redux/store/store";
import { Toaster } from "react-hot-toast";
import { logout } from "../redux/features/user/userSlice";
import UserIdDisplayer from "../components/page-components/profile-page/UserIdDisplayer";
import UserNameDisplayer from "../components/page-components/profile-page/UserNameDisplayer";
import UserProfilePhotoDisplayer from "../components/page-components/profile-page/UserProfilePhotoDisplayer";
import ChangeableInfoList from "../components/page-components/profile-page/ChangeableInfoList";
import ChangePasswordModal from "../components/page-components/profile-page/ChangePasswordModal";
import ChangeEmailModal from "../components/page-components/profile-page/ChangeEmailModal";
import useUserProfileInfo from "../lib/hooks/useUserProfileInfo";

export default function ProfilePage() {
  const [params] = useSearchParams();
  const history = params.get("history");
  const navigate = useNavigate();
  const changePasswordDialog = useRef<HTMLDialogElement>(null);
  const changeEmailDialog = useRef<HTMLDialogElement>(null);
  const currentUserId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );
  const {
    loading,
    error,
    message,
    data: user,
  } = useUserProfileInfo(currentUserId);

  const dispatch = useDispatch<StoreDispatch>();

  useEffect(() => {
    if (!currentUserId) navigate("/login");
  }, [currentUserId]);

  const loggingOut = () => {
    dispatch(logout());
  };

  if (loading) return <h1>loading...</h1>;
  if (error) return <h1>{message}</h1>;
  return (
    <div
      style={{ height: "100dvh" }}
      className=" relative dark:bg-zinc-900 bg-white  flex flex-col items-center  justify-start text-white"
    >
      <button
        onClick={() => {
          if (history) navigate(-1);
          navigate("/");
        }}
        className=" absolute right-0 top-0 m-2   text-zinc-950 dark:text-lime-500  flex flex-col  gap-1 items-center"
      >
        <ImCross /> Back
      </button>
      <h1 className=" py-2 text-left font-bold text-lg">My Profile</h1>
      <div className=" flex lg:flex-row flex-col  gap-4 p-2 rounded-md  w-96">
        <div className="flex  flex-col gap-3 w-full ">
          <div className="flex flex-col justify-center items-center gap-2 ">
            <UserProfilePhotoDisplayer />
          </div>
          <div className="flex flex-col gap-3 items-start  ">
            <UserIdDisplayer currentUserId={currentUserId} />
            <UserNameDisplayer name={user.name} />
            <ChangeableInfoList
              refs={{ changePasswordDialog, changeEmailDialog }}
            />
            <button
              onClick={loggingOut}
              className="btn text-zinc-900 bg-gradient-to-r from-lime-500 to-teal-500  border-none w-full "
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />

      <ChangePasswordModal
        dialogRef={changePasswordDialog}
        userId={currentUserId}
      />

      <ChangeEmailModal
        dialogRef={changeEmailDialog}
        email={user.email}
        userId={currentUserId}
      />
    </div>
  );
}
