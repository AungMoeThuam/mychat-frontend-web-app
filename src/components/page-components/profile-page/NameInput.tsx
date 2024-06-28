import { ChangeEvent, FormEvent, useState } from "react";
import API from "../../../service/api-setup";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";

export default function NameInput({
  name,
  initValue,
  type,
}: {
  name: string;
  initValue: string;
  type: string;
}) {
  const [username, setUsername] = useState(initValue);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const userId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );
  const isUsernameNoNeedUpdate =
    username === initValue || username.trim() === "";

  const action = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put("/user/name/update", {
        userId,
        newUsername: username,
      });
      const { name: updatedUsername } = await res.data;
      setUsername(updatedUsername);
      setEdit(false);
    } catch (error) {
      console.log("error - ", error);
    } finally {
      setLoading(false);
    }
  };

  const onchangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);

  return (
    <div className="flex items-center  justify-between    ">
      {edit ? (
        <form onSubmit={action} className="w-full">
          <input
            onChange={onchangeHandler}
            style={{
              backgroundColor: "#121318",
            }}
            name={name}
            value={username}
            type={type}
            placeholder="Type here"
            className="input input-bordered w-full mb-1"
          />
          <div className="flex  justify-end gap-2">
            <button
              type="reset"
              onClick={() => {
                setUsername(initValue);
                setEdit(false);
              }}
              className="btn btn-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUsernameNoNeedUpdate || loading}
              className={` btn-sm ${
                !isUsernameNoNeedUpdate &&
                "bg-teal-500 text-slate-950 btn border-none"
              }`}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className=" text-slate-500 ">{username}</p>
          <button onClick={() => setEdit(true)} className=" btn btn-sm ">
            Edit
          </button>
        </>
      )}
    </div>
  );
}
