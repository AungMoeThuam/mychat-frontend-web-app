import { SetStateAction, Dispatch } from "react";
import Modal from "../../share-components/modal/Modal";

type ChangeInfo = {
  changePassword: boolean;
  changeEmail: boolean;
};

export default function ChangeEmailModal({
  changeAction,
  email,
}: {
  email: string;
  changeAction: Dispatch<SetStateAction<ChangeInfo>>;
}) {
  return (
    <Modal
      onClose={() => changeAction((prev) => ({ ...prev, changeEmail: false }))}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className=" w-full m-5 lg:w-2/5 bg-slate-950 py-10 px-4 rounded-md flex flex-col justify-center items-center shadow-xl gap-5"
      >
        <h1 className=" text-lg text-white font-bold">Changing Email </h1>
        <label className="form-control w-full max-w-xs ">
          <div className="label">
            <span className="label-text text-white">Current Email</span>
          </div>
          <input
            disabled
            type="text"
            placeholder="Type here"
            value={email}
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
            type="text"
            placeholder="Type here"
            className="input input-sm input-bordered w-full max-w-xs"
          />
        </label>
        <label className="form-control w-full max-w-xs ">
          <div className="label">
            <span className="label-text text-white">
              Enter new email address
            </span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            className="input input-sm input-bordered w-full max-w-xs"
          />
        </label>{" "}
        <div className="flex    justify-center mt-2 gap-2 ">
          <button
            onClick={() =>
              changeAction((prev) => ({ ...prev, changeEmail: false }))
            }
            className=" btn btn-sm bg-red-600 border-none px-4"
          >
            cancel
          </button>
          <button className=" btn btn-sm btn-success px-5 ">save</button>
        </div>
      </div>
    </Modal>
  );
}
