import { useRef } from "react";
import { tempCatPhoto } from "../../../assets/temporaryProfilePhoto";
import UnblockActionDialog from "./UnblockActionDialog";
import { API_BASE_URL } from "../../../service/api";
import { Friend } from "../../../lib/types/types";

export default function BlockFriendCard({ friend }: { friend: Friend }) {
  const blockActionDialog = useRef<HTMLDialogElement>(null);

  return (
    <div className="flex  gap-2  justify-between p-2 rounded  items-center pr-4  text-zinc-900 dark:text-lime-500 hover:text-lime-500 dark:hover:text-zinc-950 hover:bg-zinc-900 dark:bg-gradient-to-r dark:hover:from-lime-500 dark:hover:to-teal-500">
      <div className="flex gap-2 items-center">
        <img
          className=" avatar w-10 h-10 rounded-full object-cover"
          src={
            friend.profilePhoto
              ? `${API_BASE_URL}/resources/profiles/${friend.profilePhoto.path}`
              : tempCatPhoto
          }
        />

        <h1>{friend.friendName}</h1>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => blockActionDialog.current?.showModal()}
          className=" btn btn-sm text-lime-500"
        >
          unblock
        </button>
      </div>
      {blockActionDialog && (
        <UnblockActionDialog friend={friend} dialogRef={blockActionDialog} />
      )}
    </div>
  );
}
