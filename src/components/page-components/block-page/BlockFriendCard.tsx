import { useRef } from "react";
import { backendUrlWihoutApiEndpoint } from "../../../utils/backendConfig";
import { tempCatPhoto } from "../../../assets/temporaryProfilePhoto";
import { Friend } from "../../../utils/constants/types";
import UnblockActionDialog from "./UnblockActionDialog";

export default function BlockFriendCard({ friend }: { friend: Friend }) {
  const blockActionDialog = useRef<HTMLDialogElement>(null);

  return (
    <div className="flex  gap-2  justify-between p-2 rounded  items-center pr-4  text-zinc-900 dark:text-lime-500 hover:text-lime-500 dark:hover:text-zinc-950 hover:bg-zinc-900 dark:bg-gradient-to-r dark:hover:from-lime-500 dark:hover:to-teal-500">
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
