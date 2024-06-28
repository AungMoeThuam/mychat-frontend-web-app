import { Dispatch, SetStateAction } from "react";
type ChangeInfo = {
  changePassword: boolean;
  changeEmail: boolean;
};

const buttonClassName =
  " text-start p-3 w-full rounded-md  border-none text-slate-500 shadow";
export default function ChangeableInfoList({
  setChangeInfo,
}: {
  setChangeInfo: Dispatch<SetStateAction<ChangeInfo>>;
}) {
  return (
    <>
      <button
        onClick={() =>
          setChangeInfo((prev) => ({ ...prev, changePassword: true }))
        }
        style={{
          backgroundColor: "#121318",
        }}
        className={buttonClassName}
      >
        Change Password
      </button>
      <button
        onClick={() =>
          setChangeInfo((prev) => ({ ...prev, changeEmail: true }))
        }
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
