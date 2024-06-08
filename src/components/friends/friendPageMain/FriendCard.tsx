import { Link } from "react-router-dom";
import { Friend } from "../../../utils/constants/types";
import { useState } from "react";
import UnFriendDialog from "./UnFriendDialog";
import { backendUrlWihoutApiEndpoint } from "../../../utils/backendConfig";
import { tempCatPhoto } from "../../../assets/temporaryProfilePhoto";
import BlockFriendDialog from "./addfriends/dialogs/BlockFriendDialog";

export default function FriendCard({ friend }: { friend: Friend }) {
  const [unFriendDialog, setUnFriendDialog] = useState(false);
  const [blockFriendDialog, setBlockFriendDialog] = useState(false);
  return (
    <div className="flex  gap-2  justify-between p-1 rounded  items-center pr-4   hover:bg-teal-800">
      <div className="flex gap-2">
        <img
          className=" avatar w-10 h-10 rounded-full object-cover"
          src={
            friend.profilePhoto
              ? `${backendUrlWihoutApiEndpoint}/resources/profiles/${friend.profilePhoto.path}`
              : tempCatPhoto
          }
        />

        <div>
          <h1>{friend.name}</h1>
          <small>{friend.active ? "active" : "offline"}</small>
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
          to={`/messages/${friend.roomId}/${friend.friendId}`}
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
          friendName={friend.name}
          friendId={friend.friendId}
          userId={
            friend.requester === friend.friendId
              ? friend.receipent
              : friend.requester
          }
          onClose={() => setUnFriendDialog(false)}
        />
      )}
      {blockFriendDialog && (
        <BlockFriendDialog
          people={{
            name: friend.name,
            friendId: friend.friendId,
            friendshipId: friend.roomId,
          }}
          currentUserId={
            friend.requester === friend.friendId
              ? friend.receipent
              : friend.requester
          }
          setBlockFriendDialog={() => setBlockFriendDialog(false)}
        />
      )}
    </div>
  );
}
