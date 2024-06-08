import { useState } from "react";
import { backendUrlWihoutApiEndpoint } from "../../../utils/backendConfig";
import { tempCatPhoto } from "../../../assets/temporaryProfilePhoto";
import { Friend } from "../../../utils/constants/types";
import UnblockActionDialog from "./UnblockActionDialog";

export default function BlockFriendCard({ friend }: { friend: Friend }) {
  const [blockActionDialog, setBlockActionDialog] = useState(false);

  return (
    <div className="flex  gap-2  justify-between p-2 rounded  items-center pr-4 hover:bg-teal-900">
      <div className="flex gap-2 items-center">
        <img
          className=" avatar w-10 h-10 rounded-full object-cover"
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
          onClick={() => setBlockActionDialog(true)}
          className=" btn btn-sm  bg-slate-950 border-none text-slate-400"
        >
          unblock
        </button>
      </div>
      {blockActionDialog && (
        <UnblockActionDialog
          friend={friend}
          onClose={() => setBlockActionDialog(false)}
        />
      )}
    </div>
  );
}
