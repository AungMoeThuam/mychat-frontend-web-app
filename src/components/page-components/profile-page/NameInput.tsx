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
        <form onSubmit={action} className="w-full ">
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
              className="btn btn-sm bg-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUsernameNoNeedUpdate || loading}
              className={` btn btn-sm text-zinc-950 ${
                !isUsernameNoNeedUpdate &&
                " bg-gradient-to-r from-lime-500 to-teal-500  btn border-none"
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
          <p className=" text-zinc-950 dark:text-lime-500 font-semibold ">
            {username}
          </p>
          <button
            onClick={() => setEdit(true)}
            className=" text-zinc-900 btn btn-sm bg-gradient-to-r from-lime-500 to-teal-500 dark:from-zinc-900 dark:to-zinc-900 dark:text-white"
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
}
