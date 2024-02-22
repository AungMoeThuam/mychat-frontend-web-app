import { Link } from "react-router-dom";
import { Friend } from "../../../utils/types";
import { useState } from "react";
import UnFriendDialog from "./UnFriendDialog";

export default function FriendCard({ friend }: { friend: Friend }) {
  const [unFriendDialog, setUnFriendDialog] = useState(false);
  return (
    <div className="flex  gap-2  justify-between p-1 rounded  items-center pr-4   hover:bg-teal-800">
      <div className="flex gap-2">
        <img
          className=" avatar w-10 h-10 rounded-full"
          src="https://i.natgeofe.com/n/4cebbf38-5df4-4ed0-864a-4ebeb64d33a4/NationalGeographic_1468962.jpg?w=1260&h=928"
        />

        <div>
          <h1>{friend.name}</h1>
          <small>{friend.active ? "active" : "offline"}</small>
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          to={`/messages/${friend.roomId}`}
          state={{ friendId: friend.friendId, friendName: friend.name }}
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
    </div>
  );
}
