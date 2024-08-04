import { useState, FormEvent, ChangeEvent, RefObject } from "react";
import API from "../../../service/api";
import toast from "react-hot-toast";
import Dialog from "../../share-components/Dialog";
import Button from "../../share-components/Button";

export default function ChangePasswordModal({
  userId,
  dialogRef,
}: {
  userId: string;
  dialogRef: RefObject<HTMLDialogElement>;
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
      if (res.status === 200) dialogRef.current?.close();
      toast("Updated Password ✅");
    } catch (error) {
      const err = error as any;
      seterror((prev) => ({
        ...prev,
        isError: true,
        message: err.response?.data.error,
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
    <Dialog dialogRef={dialogRef}>
      <form
        onSubmit={updatePassword}
        className=" w-[70vw] md:w-[30vw] lg:w-[25vw]  m-5 py-10 px-4 rounded-md flex flex-col justify-center items-center gap-5"
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
        <label className="form-control w-full max-w-xs   ">
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
        <div className="flex   items-center justify-center mt-2 gap-2 ">
          <Button onClick={() => dialogRef.current?.close()} type="warning">
            cancel
          </Button>
          <Button disabled={loading}>
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "save"
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
