import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { backendUrlWihoutApiEndpoint } from "../../../../utils/backendConfig";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { User } from "../../../../utils/types";
import { tempCatPhoto } from "../../../../utils/helper";
import AddFriendDialog from "./dialogs/AddFriendDialog";
import RejectOrCancelFriendRequestDialog from "./dialogs/RejectOrCancelFriendRequestDialog";
import AcceptFriendDialog from "./dialogs/AcceptFriendDialog";

export type RelationshipActionDialogs = {
  openAddFriendDialog: boolean;
  openRejectOrCancelFriendRequestDialog: boolean;
  openAcceptFriendDialog: boolean;
};

export default function AddFriendCard({ people }: { people: User }) {
  const [relationshipActionDialogs, setRelationshipActionDialogs] =
    useState<RelationshipActionDialogs>({
      openAddFriendDialog: false,
      openRejectOrCancelFriendRequestDialog: false,
      openAcceptFriendDialog: false,
    });

  const currentUserId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );
  const [queryParams] = useSearchParams();

  return (
    <div className="flex  gap-2  justify-between p-1 rounded  items-center pr-4   hover:bg-teal-800">
      <div className="flex gap-2 items-center">
        <img
          className=" avatar w-10 h-10 rounded-full"
          src={
            people.profilePhoto
              ? `${backendUrlWihoutApiEndpoint}/resources/profiles/${people.profilePhoto.path}`
              : tempCatPhoto
          }
        />

        <div>
          <h1>{people.name}</h1>
        </div>
      </div>
      <div className="flex gap-2">
        {/* //if the person is the current user itself */}
        {people.status === 5 && (
          <Link className=" btn btn-sm bg-slate-950" to={"/profile"}>
            view your profile
          </Link>
        )}
        {/* if the person does not any relation status or the status is 4 then it
         is applicable for add friend */}
        {(!people.status || people.status === 4) && (
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
        {people.status === 1 && people.requester === currentUserId && (
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
        {people.status === 1 && people.requester !== currentUserId && (
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
        {people.status === 3 && "Friend"}
      </div>

      {relationshipActionDialogs.openAddFriendDialog && (
        <AddFriendDialog
          people={people}
          currentUserId={currentUserId}
          setUnFriendShipActionDialog={setRelationshipActionDialogs}
          searchName={queryParams.get("search")}
        />
      )}
      {relationshipActionDialogs.openRejectOrCancelFriendRequestDialog && (
        <RejectOrCancelFriendRequestDialog
          RejectOrCancelDialog={
            people.requester === currentUserId ? "cancel" : "reject"
          }
          people={people}
          currentUserId={currentUserId}
          setRejectOrCancelFriendRequestDialog={setRelationshipActionDialogs}
          searchName={queryParams.get("search")}
        />
      )}
      {relationshipActionDialogs.openAcceptFriendDialog && (
        <AcceptFriendDialog
          people={people}
          currentUserId={currentUserId}
          setOpenAcceptFriendDialog={setRelationshipActionDialogs}
        />
      )}
    </div>
  );
}
