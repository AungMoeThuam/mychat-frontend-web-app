import { useState } from "react";
import { ImCross } from "react-icons/im";
import ImageInfo from "../../components/profile/ImageInfo";
import NameInput from "../../components/profile/NameInput";
import ChangeableInfoList from "../../components/profile/ChangeableInfoList";
import ChangePasswordModal from "../../components/profile/ChangePasswordModal";
import ChangeEmailModal from "../../components/profile/ChnageEmailModal";
import ChangePhoneModal from "../../components/profile/ChangePhoneModal";
import { useNavigate } from "react-router-dom";

type ChangeInfo = {
  changePassword: boolean;
  changeEmail: boolean;
  changePhoneNo: boolean;
};

export default function ProfilePage() {
  const navigate = useNavigate();

  const [changeInfo, setChangeInfo] = useState<ChangeInfo>({
    changePassword: false,
    changeEmail: false,
    changePhoneNo: false,
  });
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
            <label className="form-control w-full ">
              <div className="label  ">
                <span className="label-text text-white">Name</span>
              </div>
              <NameInput name="name" initValue="aung moe thu" type="text" />
            </label>
            <ChangeableInfoList setChangeInfo={setChangeInfo} />
            <button className="btn b bg-teal-900 border-none w-full mt-4">
              Logout
            </button>
          </div>
        </div>
      </div>
      {changeInfo.changePassword && (
        <ChangePasswordModal changeAction={setChangeInfo} />
      )}
      {changeInfo.changeEmail && (
        <ChangeEmailModal changeAction={setChangeInfo} />
      )}
      {changeInfo.changePhoneNo && (
        <ChangePhoneModal changeAction={setChangeInfo} />
      )}
    </div>
  );
}
