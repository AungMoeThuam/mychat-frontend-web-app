import { RefObject } from "react";

const buttonClassName =
  " text-start p-3 w-full rounded-md  border-none text-slate-500 shadow";
export default function ChangeableInfoList({
  refs,
}: {
  refs: {
    changePasswordDialog: RefObject<HTMLDialogElement>;
    changeEmailDialog: RefObject<HTMLDialogElement>;
  };
}) {
  const { changePasswordDialog, changeEmailDialog } = refs;
  return (
    <>
      <button
        onClick={() => changePasswordDialog.current?.showModal()}
        style={{
          backgroundColor: "#121318",
        }}
        className={buttonClassName}
      >
        Change Password
      </button>
      <button
        onClick={() => changeEmailDialog.current?.showModal()}
        style={{
          backgroundColor: "#121318",
        }}
        className={buttonClassName}
      >
        Change Email
      </button>
    </>
  );
}
