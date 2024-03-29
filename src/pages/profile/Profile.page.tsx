import { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import UserProfilePhotoDisplayer from "../../components/page-components/profile.page/UserProfilePhotoDisplayer";
import ChangeableInfoList from "../../components/page-components/profile.page/ChangeableInfoList";
import ChangePasswordModal from "../../components/page-components/profile.page/ChangePasswordModal";
import ChangeEmailModal from "../../components/page-components/profile.page/ChnageEmailModal";
import ChangePhoneModal from "../../components/page-components/profile.page/ChangePhoneModal";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../redux/store/store";
import { Toaster } from "react-hot-toast";
import { logout } from "../../redux/slices/authSlice";
import useUserProfileInfo from "../../hooks/useUserProfileInfo";
import UserIdDisplayer from "../../components/page-components/profile.page/UserIdDisplayer";
import UserNameDisplayer from "../../components/page-components/profile.page/UserNameDisplayer";

type ChangeInfo = {
  changePassword: boolean;
  changeEmail: boolean;
  changePhoneNo: boolean;
};

export default function ProfilePage() {
  const navigate = useNavigate();
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
  const [changeInfo, setChangeInfo] = useState<ChangeInfo>({
    changePassword: false,
    changeEmail: false,
    changePhoneNo: false,
  });

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
      style={{ backgroundColor: "#18191d", height: "100dvh" }}
      className=" relative  flex flex-col items-center  justify-start text-white"
    >
      <button
        onClick={() => navigate(-1)}
        className=" absolute right-0 top-0 m-2 text-teal-500 hover:text-teal-900  flex flex-col  gap-1 items-center"
      >
        <ImCross /> Back
      </button>
      <h1 className=" py-2 text-left font-bold text-lg">My Profile</h1>
      <div
        style={{ backgroundColor: "#18181f" }}
        className=" flex lg:flex-row flex-col  gap-4 p-2 rounded-md  w-96"
      >
        <div className="flex  flex-col gap-3 w-full ">
          <div className="flex flex-col justify-center items-center gap-2 ">
            <UserProfilePhotoDisplayer />
          </div>
          <div className="flex flex-col gap-3 items-start  ">
            <UserIdDisplayer currentUserId={currentUserId} />
            <UserNameDisplayer name={user.name} />
            <ChangeableInfoList setChangeInfo={setChangeInfo} />
            <button
              onClick={loggingOut}
              className="btn  bg-teal-900 border-none w-full "
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" />

      {/* modal dialogs */}

      {changeInfo.changePassword && (
        <ChangePasswordModal changeAction={setChangeInfo} />
      )}
      {changeInfo.changeEmail && (
        <ChangeEmailModal changeAction={setChangeInfo} email={user.email} />
      )}
      {changeInfo.changePhoneNo && (
        <ChangePhoneModal changeAction={setChangeInfo} phone={user.phone} />
      )}
    </div>
  );
}
