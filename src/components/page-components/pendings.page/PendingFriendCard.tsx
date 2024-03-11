import { useState } from "react";
import { backendUrlWihoutApiEndpoint } from "../../../utils/backendConfig";
import { tempCatPhoto } from "../../../utils/helper";
import PendingActionDialog from "./PendingActionDialog";
import { Friend } from "../../../utils/types";

export default function PendingFriendCard({ friend }: { friend: Friend }) {
  const [pendingActionDialog, setPendingActionDialog] = useState(false);

  return (
    <div className="flex  gap-2  justify-between p-2 rounded  items-center pr-4 hover:bg-teal-900">
      <div className="flex gap-2 items-center">
        <img
          className=" avatar w-10 h-10 rounded-full"
          src={
            friend.profilePhoto
              ? `${backendUrlWihoutApiEndpoint}/resources/profiles/${friend.profilePhoto.path}`
              : tempCatPhoto
          }
        />

        <h1>{friend.name}</h1>
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
          friend={friend}
          onClose={() => setPendingActionDialog(false)}
        />
      )}
    </div>
  );
}
