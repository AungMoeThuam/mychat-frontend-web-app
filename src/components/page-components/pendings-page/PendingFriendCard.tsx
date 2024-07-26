import { useRef } from "react";
import { backendUrlWihoutApiEndpoint } from "../../../utils/backendConfig";
import { tempCatPhoto } from "../../../assets/temporaryProfilePhoto";
import PendingActionDialog from "./PendingActionDialog";
import { Person } from "../../../lib/models/models";

export default function PendingFriendCard({ person }: { person: Person }) {
  const pendingActionDialog = useRef<HTMLDialogElement>(null);

  return (
    <div className="flex  gap-2  justify-between p-2 rounded  items-center pr-4 text-zinc-900 dark:text-lime-500 hover:text-lime-500 dark:hover:text-zinc-950 hover:bg-zinc-900 dark:bg-gradient-to-r dark:hover:from-lime-500 dark:hover:to-teal-500">
      <div className="flex gap-2 items-center">
        <img
          className=" avatar w-10 h-10 rounded-full object-cover"
          src={
            person.profilePhoto
              ? `${backendUrlWihoutApiEndpoint}/resources/profiles/${person.profilePhoto.path}`
              : tempCatPhoto
          }
        />

        <h1>{person.personName}</h1>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => pendingActionDialog.current?.showModal()}
          className=" btn btn-sm text-lime-500"
        >
          Cancel
        </button>
      </div>

      <PendingActionDialog person={person} dialogRef={pendingActionDialog} />
    </div>
  );
}
