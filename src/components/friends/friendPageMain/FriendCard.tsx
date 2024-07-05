import { Link } from "react-router-dom";
import { useState } from "react";
import UnFriendDialog from "./UnFriendDialog";
import { backendUrlWihoutApiEndpoint } from "../../../utils/backendConfig";
import { tempCatPhoto } from "../../../assets/temporaryProfilePhoto";
import BlockFriendDialog from "./addfriends/dialogs/BlockFriendDialog";
import { Friend } from "../../../lib/models/models";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { BsPersonFillDash, BsPersonFillSlash } from "react-icons/bs";
import { BiSolidMessageSquareDetail } from "react-icons/bi";

export default function FriendCard({ friend }: { friend: Friend }) {
  const [unFriendDialog, setUnFriendDialog] = useState(false);
  const [blockFriendDialog, setBlockFriendDialog] = useState(false);
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
              ? `${backendUrlWihoutApiEndpoint}/resources/profiles/${friend.profilePhoto.path}`
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
          onClick={() => setBlockFriendDialog(true)}
          className="tooltip tooltip-left"
          data-tip="Block"
        >
          <BsPersonFillSlash size={24} />
        </button>
        <button
          onClick={() => setUnFriendDialog(true)}
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
      {unFriendDialog && (
        <UnFriendDialog
          friend={friend}
          onClose={() => setUnFriendDialog(false)}
        />
      )}
      {blockFriendDialog && (
        <BlockFriendDialog
          people={{
            name: friend.friendName,
            friendId: friend.friendId,
            friendshipId: friend.friendshipId,
          }}
          currentUserId={currentUserId}
          setBlockFriendDialog={() => setBlockFriendDialog(false)}
        />
      )}
    </div>
  );
}
