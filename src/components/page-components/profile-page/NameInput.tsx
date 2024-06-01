import { ChangeEvent, useState } from "react";

export default function NameInput({
  name,
  initValue,
  type,
}: {
  name: string;
  initValue: string;
  type: string;
}) {
  const [value, setValue] = useState(initValue);
  const [edit, setEdit] = useState(false);

  const action = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };
  return (
    <div className="flex items-center  justify-between    ">
      {edit ? (
        <form className="w-full">
          <input
            onChange={action}
            style={{
              backgroundColor: "#121318",
            }}
            name={name}
            value={value}
            type={type}
            placeholder="Type here"
            className="input input-bordered w-full mb-1"
          />
          <div className="flex  justify-end gap-2">
            <button onClick={() => setEdit(false)} className="btn btn-sm">
              Cancel
            </button>
            <button
              onClick={() => console.log(action)}
              disabled={
                value === initValue || value.trim() === "" ? true : false
              }
              className={` btn-sm ${
                value === initValue || value.trim() === ""
                  ? ""
                  : "bg-teal-500 text-slate-950 btn border-none"
              }`}
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className=" text-slate-500 ">{initValue}</p>
          <button onClick={() => setEdit(true)} className=" btn btn-sm ">
            Edit
          </button>
        </>
      )}
    </div>
  );
}
