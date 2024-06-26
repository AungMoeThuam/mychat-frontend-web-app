import {
  SetStateAction,
  Dispatch,
  FormEvent,
  ChangeEvent,
  useState,
} from "react";
import Modal from "../../share-components/modal/Modal";
import API from "../../../service/api-setup";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

type ChangeInfo = {
  changePassword: boolean;
  changeEmail: boolean;
};

export default function ChangeEmailModal({
  changeAction,
  email,
  userId,
}: {
  userId: string;
  email: string;
  changeAction: Dispatch<SetStateAction<ChangeInfo>>;
}) {
  const [updateEmailInfo, setUpdateEmailInfo] = useState({
    password: "",
    newEmail: "",
    oldEmail: email,
  });
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState({ isError: false, message: "" });
  const updateEmail = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();
    console.log(updateEmailInfo);
    try {
      const res = await API.put("/user/email/update", {
        userId,
        ...updateEmailInfo,
      });

      if (res.status === 200) closeModal();
      toast("Updated email ✅");
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
    setUpdateEmailInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  const closeModal = () =>
    changeAction((prev) => ({ ...prev, changeEmail: false }));
  return (
    <Modal onClose={closeModal}>
      <form
        onSubmit={updateEmail}
        onClick={(e) => e.stopPropagation()}
        className=" w-full m-5 lg:w-2/5 bg-slate-950 py-10 px-4 rounded-md flex flex-col justify-center items-center shadow-xl gap-5"
      >
        <h1 className=" text-lg text-white font-bold">Changing Email </h1>
        <label className="form-control w-full max-w-xs ">
          <div className="label">
            <span className="label-text text-white">Current Email</span>
          </div>
          <input
            onChange={onChangeHandler}
            disabled
            type="email"
            placeholder="Type here"
            value={updateEmailInfo.oldEmail}
            className="input input-sm input-bordered w-full max-w-xs"
          />
        </label>
        <label className="form-control w-full max-w-xs ">
          <div className="label">
            <span className="label-text text-white">
              Enter current password
            </span>
          </div>
          <input
            onChange={onChangeHandler}
            value={updateEmailInfo.password}
            name="password"
            type="password"
            placeholder="Type here"
            className="input input-sm input-bordered w-full max-w-xs"
            required
          />
        </label>
        <label className="form-control w-full max-w-xs ">
          <div className="label">
            <span className="label-text text-white">
              Enter new email address
            </span>
          </div>
          <input
            onChange={onChangeHandler}
            value={updateEmailInfo.newEmail}
            name="newEmail"
            type="email"
            placeholder="Type here"
            className="input input-sm input-bordered w-full max-w-xs"
            required
          />
        </label>{" "}
        {error.isError && (
          <p className=" text-sm font-semibold text-red-500">{error.message}</p>
        )}
        <div className="flex    justify-center mt-2 gap-2 ">
          <button
            onClick={closeModal}
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
