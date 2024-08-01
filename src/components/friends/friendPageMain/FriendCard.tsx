import { Link } from "react-router-dom";
import { useRef } from "react";
import UnFriendDialog from "./UnFriendDialog";
import { tempCatPhoto } from "../../../assets/temporaryProfilePhoto";
import BlockFriendDialog from "./addfriends/dialogs/BlockFriendDialog";
import { Friend } from "../../../lib/models/models";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { BsPersonFillDash, BsPersonFillSlash } from "react-icons/bs";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { API_BASE_URL } from "../../../service/api-setup";

export default function FriendCard({ friend }: { friend: Friend }) {
  const blockDialog = useRef<HTMLDialogElement>(null);
  const unFriendDialog = useRef<HTMLDialogElement>(null);
  const currentUserId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );
  return (
    <div className="flex gap-2 justify-between p-1 rounded  items-center pr-4 text-zinc-900 dark:text-lime-500 hover:text-lime-500 bg-gradient-to-r  hover:bg-zinc-900  dark:hover:text-zinc-900 dark:hover:from-lime-500 dark:hover:to-teal-500">
      <div className="flex gap-2">
        <img
          className=" avatar w-10 h-10 rounded-full object-cover"
          src={
            friend.profilePhoto
              ? `${API_BASE_URL}/resources/profiles/${friend.profilePhoto.path}`
              : tempCatPhoto
          }
        />

        <div className=" ">
          <h1>{friend.friendName}</h1>
          <small>{friend.isActiveNow ? "active" : "offline"}</small>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => blockDialog.current?.showModal()}
          className="tooltip tooltip-left"
          data-tip="Block"
        >
          <BsPersonFillSlash size={24} />
        </button>
        <button
          onClick={() => unFriendDialog.current?.showModal()}
          className="tooltip tooltip-left"
          data-tip="Un Friend"
        >
          <BsPersonFillDash size={24} />
        </button>
        <Link
          to={`/messages/${friend.friendshipId}/${friend.friendId}`}
          className="tooltip tooltip-left"
          data-tip="Message"
        >
          <BiSolidMessageSquareDetail size={24} />
        </Link>
      </div>

      <UnFriendDialog dialogRef={unFriendDialog} friend={friend} />

      <BlockFriendDialog
        people={{
          name: friend.friendName,
          friendId: friend.friendId,
          friendshipId: friend.friendshipId,
        }}
        currentUserId={currentUserId}
        dialogRef={blockDialog}
      />
    </div>
  );
}
