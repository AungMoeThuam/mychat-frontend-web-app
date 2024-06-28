import { useState } from "react";
import { backendUrlWihoutApiEndpoint } from "../../../utils/backendConfig";
import { tempCatPhoto } from "../../../assets/temporaryProfilePhoto";
import PendingActionDialog from "./PendingActionDialog";
import { Person } from "../../../lib/models/models";

export default function PendingFriendCard({ person }: { person: Person }) {
  const [pendingActionDialog, setPendingActionDialog] = useState(false);

  return (
    <div className="flex  gap-2  justify-between p-2 rounded  items-center pr-4 hover:bg-teal-900">
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
          onClick={() => setPendingActionDialog(true)}
          className=" btn btn-sm  bg-slate-950 border-none text-slate-400"
        >
          Cancel
        </button>
      </div>
      {pendingActionDialog && (
        <PendingActionDialog
          person={person}
          onClose={() => setPendingActionDialog(false)}
        />
      )}
    </div>
  );
}
