import { Link } from "react-router-dom";
import { useState } from "react";
import UnFriendDialog from "./UnFriendDialog";
import { backendUrlWihoutApiEndpoint } from "../../../utils/backendConfig";
import { tempCatPhoto } from "../../../assets/temporaryProfilePhoto";
import BlockFriendDialog from "./addfriends/dialogs/BlockFriendDialog";
import { Friend } from "../../../lib/models/models";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";

export default function FriendCard({ friend }: { friend: Friend }) {
  const [unFriendDialog, setUnFriendDialog] = useState(false);
  const [blockFriendDialog, setBlockFriendDialog] = useState(false);
  const currentUserId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );
  return (
    <div className="flex gap-2 justify-between p-1 rounded  items-center pr-4 bg-gradient-to-r  hover:text-zinc-900 hover:from-lime-500 hover:to-teal-500">
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
          <h1 >{friend.friendName}</h1>
          <small>{friend.isActiveNow ? "active" : "offline"}</small>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setBlockFriendDialog(true)}
          className=" btn btn-sm    bg-red-500  text-slate-950"
        >
          Block
        </button>
        <Link
          to={`/messages/${friend.friendshipId}/${friend.friendId}`}
          className="btn  btn-sm hover:text-slate-400  bg-teal-500 text-black"
        >
          message
        </Link>
        <button
          onClick={() => setUnFriendDialog(true)}
          className="btn btn-sm   bg-slate-950"
        >
          Unfriend
        </button>
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
