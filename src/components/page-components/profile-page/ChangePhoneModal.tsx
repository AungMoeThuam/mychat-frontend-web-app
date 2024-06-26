import { SetStateAction, Dispatch } from "react";
import Modal from "../../share-components/modal/Modal";

type ChangeInfo = {
  changePassword: boolean;
  changeEmail: boolean;
  changePhoneNo: boolean;
};

export default function ChangePhoneModal({
  changeAction,
  phone,
}: {
  changeAction: Dispatch<SetStateAction<ChangeInfo>>;
  phone: string;
}) {
  return (
    <Modal
      onClose={() =>
        changeAction((prev) => ({ ...prev, changePhoneNo: false }))
      }
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className=" w-full m-5 lg:w-2/5 bg-slate-950 py-10 px-4 rounded-md flex flex-col justify-center items-center shadow-xl gap-5"
      >
        <h1 className=" text-lg text-white font-bold">
          Changing Phone Number{" "}
        </h1>
        <label className="form-control w-full max-w-xs ">
          <div className="label">
            <span className="label-text text-white">Current Phone</span>
          </div>
          <input
            disabled
            type="text"
            value={!phone.trim() ? "none" : phone}
            placeholder="Type here"
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
              Enter new phone number
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
              changeAction((prev) => ({ ...prev, changePhoneNo: false }))
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
