import { useState } from "react";
import { Link } from "react-router-dom";
import { backendUrlWihoutApiEndpoint } from "../../../../utils/backendConfig";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { tempCatPhoto } from "../../../../assets/temporaryProfilePhoto";
import AddFriendDialog from "./dialogs/AddFriendDialog";
import RejectOrCancelFriendRequestDialog from "./dialogs/RejectOrCancelFriendRequestDialog";
import AcceptFriendDialog from "./dialogs/AcceptFriendDialog";
import BlockFriendDialog from "./dialogs/BlockFriendDialog";
import { Person } from "../../../../lib/models/models";

export type RelationshipActionDialogs = {
  openAddFriendDialog: boolean;
  openRejectOrCancelFriendRequestDialog: boolean;
  openAcceptFriendDialog: boolean;
  openBlockFriendDialog: boolean;
};

export default function AddFriendCard({ people }: { people: Person }) {
  const [relationshipActionDialogs, setRelationshipActionDialogs] =
    useState<RelationshipActionDialogs>({
      openAddFriendDialog: false,
      openRejectOrCancelFriendRequestDialog: false,
      openAcceptFriendDialog: false,
      openBlockFriendDialog: false,
    });

  const currentUserId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );

  return (
    <div className="flex  gap-2  justify-between p-1 rounded  items-center pr-4   hover:bg-teal-800">
      <div className="flex gap-2 items-center">
        <img
          className=" avatar w-10 h-10 rounded-full object-cover"
          src={
            people.profilePhoto
              ? `${backendUrlWihoutApiEndpoint}/resources/profiles/${people.profilePhoto.path}`
              : tempCatPhoto
          }
        />

        <div>
          <h1>{people.personName}</h1>
        </div>
      </div>
      <div className="flex gap-2">
        {/* //if the person is the current user itself */}

        {people.friendshipStatus === 5 && (
          <Link className=" btn btn-sm bg-slate-950" to={"/profile"}>
            view your profile
          </Link>
        )}
        {/* if the person does not have any relation status or the status is 4 then it
         is applicable for add friend */}
        {(!people.friendshipStatus || people.friendshipStatus === 4) && (
          <button
            onClick={() =>
              setRelationshipActionDialogs((prev) => ({
                ...prev,
                openAddFriendDialog: true,
              }))
            }
            className="btn  btn-sm hover:text-slate-400  bg-teal-500 text-black"
          >
            Add Friend
          </button>
        )}
        {/* if the person status 1 and requester in that relation is the current */}
        {/* user */}
        {people.friendshipStatus === 1 &&
          people.friendshipInitiatorId === currentUserId && (
            <button
              onClick={() => {
                setRelationshipActionDialogs((prev) => ({
                  ...prev,
                  openRejectOrCancelFriendRequestDialog: true,
                }));
              }}
              className=" btn btn-sm   bg-slate-700"
            >
              cancel request
            </button>
          )}
        {/* if the person status 1 and requester in that relation is not the */}
        {/* current user */}
        {people.friendshipStatus === 1 &&
          people.friendshipInitiatorId !== currentUserId && (
            <div>
              <button
                onClick={() => {
                  setRelationshipActionDialogs((prev) => ({
                    ...prev,
                    openAcceptFriendDialog: true,
                  }));
                }}
                className=" btn btn-sm     bg-teal-500  text-slate-950"
              >
                {relationshipActionDialogs.openAcceptFriendDialog
                  ? "loading..."
                  : "accept request"}
              </button>

              <button
                onClick={() =>
                  setRelationshipActionDialogs((prev) => ({
                    ...prev,
                    openRejectOrCancelFriendRequestDialog: true,
                  }))
                }
                className=" btn btn-sm     bg-teal-500  text-slate-950"
              >
                reject request
              </button>
            </div>
          )}
        {/* if the person is already friend with the current user */}
        {people.friendshipStatus === 3 && "Friend"}
        {people.friendshipStatus !== 5 && (
          <button
            onClick={() =>
              setRelationshipActionDialogs((prev) => ({
                ...prev,
                openBlockFriendDialog: true,
              }))
            }
            className=" btn btn-sm    bg-red-500  text-slate-950"
          >
            Block
          </button>
        )}
      </div>

      {relationshipActionDialogs.openAddFriendDialog && (
        <AddFriendDialog
          people={people}
          currentUserId={currentUserId}
          setUnFriendShipActionDialog={setRelationshipActionDialogs}
        />
      )}
      {relationshipActionDialogs.openRejectOrCancelFriendRequestDialog && (
        <RejectOrCancelFriendRequestDialog
          RejectOrCancelDialog={
            people.friendshipInitiatorId === currentUserId ? "cancel" : "reject"
          }
          people={people}
          currentUserId={currentUserId}
          setRejectOrCancelFriendRequestDialog={setRelationshipActionDialogs}
        />
      )}
      {relationshipActionDialogs.openAcceptFriendDialog && (
        <AcceptFriendDialog
          people={people}
          currentUserId={currentUserId}
          setOpenAcceptFriendDialog={setRelationshipActionDialogs}
        />
      )}
      {relationshipActionDialogs.openBlockFriendDialog && (
        <BlockFriendDialog
          people={{
            friendId: people.personId,
            friendshipId: people.friendshipId!,
            name: people.personName,
          }}
          currentUserId={currentUserId}
          setBlockFriendDialog={setRelationshipActionDialogs}
        />
      )}
    </div>
  );
}
