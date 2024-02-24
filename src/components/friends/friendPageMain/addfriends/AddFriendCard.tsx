import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { backendUrlWihoutApiEndpoint } from "../../../../utils/backendConfig";
import { Api } from "../../../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../../../redux/store/store";
import { User } from "../../../../utils/types";
import toast from "react-hot-toast";
import { tempCatPhoto } from "../../../../utils/helper";
import AddFriendDialog from "./dialogs/AddFriendDialog";
import RejectOrCancelFriendRequestDialog from "./dialogs/RejectOrCancelFriendRequestDialog";
import { updateSearchFriends } from "../../../../redux/slice/searchFriendSlice";

export type RelationshipActionDialogs = {
  openAddFriendDialog: boolean;
  openRejectOrCancelFriendRequestDialog: boolean;
  acceptFriend: boolean;
};

export default function AddFriendCard({ people }: { people: User }) {
  const dispatch = useDispatch<StoreDispatch>();
  const [relationshipActionDialogs, setRelationshipActionDialogs] =
    useState<RelationshipActionDialogs>({
      openAddFriendDialog: false,
      openRejectOrCancelFriendRequestDialog: false,
      acceptFriend: false,
    });

  const currentUserId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );
  const [queryParams] = useSearchParams();

  const acceptFriendRequest = async () => {
    try {
      const { data, status } = await Api.manageFriendShipStatus({
        relationshipStatus: people.status,
        id: people._id,
        currentUserId,
        type: "accept",
      });
      if (status === "success") {
        toast("you have accepted a friend request");
        setRelationshipActionDialogs((prev) => ({
          ...prev,
          acceptFriend: false,
        }));
        dispatch(
          updateSearchFriends({
            receipent: currentUserId,
            requester: people._id,
            status: 3,
          })
        );
      } else {
        toast(data + "❌");
        setRelationshipActionDialogs((prev) => ({
          ...prev,
          acceptFriend: false,
        }));
      }
    } catch (error: any) {
      toast(error.message + "❌");
      setRelationshipActionDialogs((prev) => ({
        ...prev,
        acceptFriend: false,
      }));
    }
  };

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
        {people.status === 5 && (
          <Link className=" btn btn-sm bg-slate-950" to={"/profile"}>
            view your profile
          </Link>
        )}
        {!people.status && (
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
        {people.status === 1 && people.requester !== currentUserId && (
          <div>
            <button
              disabled={relationshipActionDialogs.acceptFriend ? true : false}
              onClick={() => {
                setRelationshipActionDialogs((prev) => ({
                  ...prev,
                  acceptFriend: true,
                }));
                acceptFriendRequest();
              }}
              className=" btn btn-sm     bg-teal-500  text-slate-950"
            >
              {relationshipActionDialogs.acceptFriend
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
    </div>
  );
}
