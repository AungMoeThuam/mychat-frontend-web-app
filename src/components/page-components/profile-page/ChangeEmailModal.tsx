import { FormEvent, ChangeEvent, useState, RefObject } from "react";
import API from "../../../service/api";
import toast from "react-hot-toast";
import Dialog from "../../share-components/Dialog";
import Button from "../../share-components/Button";

export default function ChangeEmailModal({
  dialogRef,
  email,
  userId,
}: {
  userId: string;
  email: string;
  dialogRef: RefObject<HTMLDialogElement>;
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
    setUpdateEmailInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  const closeModal = () => dialogRef.current?.close();
  return (
    <Dialog dialogRef={dialogRef}>
      <form
        onSubmit={updateEmail}
        className=" w-[70vw] md:w-[30vw] lg:w-[25vw] m-5 py-10 px-4 rounded-md flex flex-col justify-center items-center gap-5"
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
          <Button onClick={closeModal} type="warning">
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
