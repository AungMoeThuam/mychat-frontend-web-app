import { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "warning" | "success";
  children: ReactNode;
  disabled?: boolean;
}
export default function Button({
  onClick,
  children,
  type = "success",
  disabled,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={type == "success" ? "btn-success" : "btn-warning"}
    >
      {children}
    </button>
  );
}
