import { ReactNode, RefObject } from "react";

export default function Dialog({
  dialogRef,
  children,
  CloseToClickOutside = true,
}: {
  dialogRef: RefObject<HTMLDialogElement>;
  children: ReactNode;
  CloseToClickOutside?: boolean;
}) {
  return (
    <dialog ref={dialogRef} id="my_modal_2" className="modal">
      <div className="modal-box text-zinc-950 dark:text-lime-500 flex flex-col justify-center items-center gap-2">
        {children}
      </div>
      {CloseToClickOutside && (
        <form method="dialog" className=" modal-backdrop">
          <button>close</button>
        </form>
      )}
    </dialog>
  );
}
