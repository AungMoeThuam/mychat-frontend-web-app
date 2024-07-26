import {
  SetStateAction,
  Dispatch,
  useState,
  FormEvent,
  ChangeEvent,
} from "react";
import Modal from "../../share-components/Modal";
import API from "../../../service/api-setup";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

type ChangeInfo = {
  changePassword: boolean;
  changeEmail: boolean;
};

export default function ChangePasswordModal({
  userId,
  changeAction,
}: {
  userId: string;
  changeAction: Dispatch<SetStateAction<ChangeInfo>>;
}) {
  const [updatePasswordInfo, setUpdatePasswordInfo] = useState({
    oldPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState({ isError: false, message: "" });
  const updatePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(updatePasswordInfo);
    setLoading(true);
    try {
      if (
        updatePasswordInfo.newPassword !== updatePasswordInfo.newPasswordConfirm
      )
        return seterror((prev) => ({
          ...prev,
          isError: true,
          message: "passwords are not matched!",
        }));
      const res = await API.put("/user/password/update", {
        userId,
        ...updatePasswordInfo,
      });
      if (res.status === 200)
        changeAction((prev) => ({ ...prev, changePassword: false }));
      toast("Updated Password ✅");
    } catch (error) {
      if (error instanceof AxiosError)
        seterror((prev) => ({
          ...prev,
          isError: true,
          message: error.response?.data.error,
        }));
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setUpdatePasswordInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  return (
    <Modal
      onClose={() =>
        changeAction((prev) => ({ ...prev, changePassword: false }))
      }
    >
      <form
        onSubmit={updatePassword}
        onClick={(e) => e.stopPropagation()}
        className=" w-full m-5 lg:w-2/5 bg-slate-950 py-10 px-4 rounded-md flex flex-col justify-center items-center shadow-xl gap-5"
      >
        <h1 className=" text-lg text-white font-bold">Changing Password </h1>
        <label className="form-control w-full max-w-xs ">
          <div className="label">
            <span className="label-text text-white">
              Enter current password
            </span>
          </div>
          <input
            onChange={onChangeHandler}
            name="oldPassword"
            value={updatePasswordInfo.oldPassword}
            type="text"
            placeholder="Type here"
            className="input input-sm input-bordered w-full max-w-xs"
          />
        </label>
        <label className="form-control w-full max-w-xs ">
          <div className="label">
            <span className="label-text text-white">Enter new password</span>
          </div>
          <input
            onChange={onChangeHandler}
            name="newPassword"
            value={updatePasswordInfo.newPassword}
            type="text"
            placeholder="Type here"
            className="input input-sm input-bordered w-full max-w-xs"
          />
        </label>{" "}
        <label className="form-control w-full max-w-xs ">
          <div className="label">
            <span className="label-text text-white">Confirm password</span>
          </div>
          <input
            onChange={onChangeHandler}
            name="newPasswordConfirm"
            value={updatePasswordInfo.newPasswordConfirm}
            type="text"
            placeholder="Type here"
            className="input input-sm input-bordered w-full max-w-xs"
          />
        </label>
        {error.isError && (
          <p className=" font-semibold text-red-500">{error.message}</p>
        )}
        <div className="flex    justify-center mt-2 gap-2 ">
          <button
            type="reset"
            onClick={() =>
              changeAction((prev) => ({ ...prev, changePassword: false }))
            }
            className=" btn btn-sm bg-red-600 border-none px-4"
          >
            cancel
          </button>
          <button disabled={loading} className=" btn btn-sm btn-success px-5 ">
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "save"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
