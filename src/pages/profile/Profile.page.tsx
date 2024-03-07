import { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import ImageInfo from "../../components/profile/ImageInfo";
import NameInput from "../../components/profile/NameInput";
import ChangeableInfoList from "../../components/profile/ChangeableInfoList";
import ChangePasswordModal from "../../components/profile/ChangePasswordModal";
import ChangeEmailModal from "../../components/profile/ChnageEmailModal";
import ChangePhoneModal from "../../components/profile/ChangePhoneModal";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../../utils/backendConfig";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../redux/store/store";
import toast, { Toaster } from "react-hot-toast";
import { logout } from "../../redux/slice/authSlice";

type ChangeInfo = {
  changePassword: boolean;
  changeEmail: boolean;
  changePhoneNo: boolean;
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    loading: false,
    error: false,
    message: "",
    data: { name: "", email: "", _id: "", phone: "" },
  });
  const currentUserId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );

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

  useEffect(() => {
    async function fetchUserInfo() {
      setUserInfo((prev) => ({ ...prev, loading: true }));
      try {
        const res = await fetch(`${backendUrl}/user/${currentUserId}`, {
          method: "GET",
        });
        const result = await res.json();
        if (result.status === "success") {
          setUserInfo((prev) => ({
            ...prev,
            loading: false,
            data: result.data,
          }));
        } else {
          setUserInfo((prev) => ({
            ...prev,
            loading: false,
            error: true,
            message: result.message,
          }));
        }
      } catch (error: any) {
        setUserInfo((prev) => ({
          ...prev,
          loading: false,
          error: true,
          message: error.message,
        }));
      }
    }
    fetchUserInfo();
  }, []);
  if (userInfo.loading) return <h1>loading...</h1>;
  if (userInfo.error) return <h1>{userInfo.message}</h1>;
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
      <h1 className=" my-5 text-left font-bold text-lg">My Profile</h1>
      <div
        style={{ backgroundColor: "#18181f" }}
        className=" flex lg:flex-row flex-col  gap-4 p-2 rounded-md  w-96"
      >
        <div className="flex  flex-col gap-3 w-full ">
          <div className="flex flex-col justify-center items-center gap-2 ">
            <ImageInfo />
          </div>
          <div className="flex flex-col gap-3 items-start  ">
            <div className="flex  items-center gap-5">
              <h1 className=" font-mono text-slate-500">
                id - <b>{currentUserId}</b>{" "}
              </h1>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentUserId).then(() =>
                    toast.success("copied id", {
                      style: {
                        border: "1px solid #713200",
                        padding: "16px",
                        color: "#713200",
                      },
                      iconTheme: {
                        primary: "#713200",
                        secondary: "#FFFAEE",
                      },
                    })
                  );
                }}
                className="btn btn-sm bg-teal-800"
              >
                copy id
              </button>
            </div>
            <label className="form-control w-full ">
              <div className="label  ">
                <span className="label-text text-white">Name</span>
              </div>
              <NameInput
                name="name"
                initValue={userInfo.data.name}
                type="text"
              />
            </label>
            <ChangeableInfoList setChangeInfo={setChangeInfo} />
            <button
              onClick={loggingOut}
              className="btn b bg-teal-900 border-none w-full mt-4"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" />
      {changeInfo.changePassword && (
        <ChangePasswordModal changeAction={setChangeInfo} />
      )}
      {changeInfo.changeEmail && (
        <ChangeEmailModal
          changeAction={setChangeInfo}
          email={userInfo.data.email}
        />
      )}
      {changeInfo.changePhoneNo && (
        <ChangePhoneModal
          changeAction={setChangeInfo}
          phone={userInfo.data.phone}
        />
      )}
    </div>
  );
}
