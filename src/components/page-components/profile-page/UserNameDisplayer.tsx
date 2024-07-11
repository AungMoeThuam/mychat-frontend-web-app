import NameInput from "./NameInput";

export default function UserNameDisplayer(props: { name: string }) {
  const { name } = props;
  return (
    <label className="form-control w-full ">
      <div className="label  ">
        <span className="label-text text-zinc-950 dark:text-lime-500 font-bold">
          Name
        </span>
      </div>
      <NameInput name="name" initValue={name} type="text" />
    </label>
  );
}
