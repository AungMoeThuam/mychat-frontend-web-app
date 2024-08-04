import { ChangeEventHandler } from "react";

export default function Input({
  name,
  type,
  placeholder,
  onChange,
}: {
  name: string;
  type: string;
  placeholder?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <>
      <label htmlFor={name}>{name}</label>
      <input
        required
        className="rounded-md border p-2 bg-slate-100  "
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        onChange={onChange}
      />
    </>
  );
}
