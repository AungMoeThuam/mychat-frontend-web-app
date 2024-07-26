import { useRef, useState } from "react";
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
import { BsPersonFillAdd, BsPersonFillSlash } from "react-icons/bs";

export default function AddFriendCard({ people }: { people: Person }) {
  const blockDialog = useRef<HTMLDialogElement>(null);
  const addFriendDialog = useRef<HTMLDialogElement>(null);
  const rejectOrCancelFriendDialog = useRef<HTMLDialogElement>(null);
  const [openAcceptFriendDialog, setOpenAcceptFriendDialog] = useState(false);
  const currentUserId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );

  console.log("re render add friend card ");

  return (
    <div className="flex  gap-2  justify-between p-1 rounded  items-center pr-4 text-zinc-900 dark:text-lime-500 hover:text-lime-500 dark:hover:text-zinc-900  hover:bg-zinc-900 dark:bg-gradient-to-r dark:hover:from-lime-500 dark:hover:to-teal-500">
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
          <Link className=" btn btn-sm text-lime-500" to={"/profile"}>
            view profile
          </Link>
        )}
        {/* if the person does not have any relation status or the status is 4 then it
         is applicable for add friend */}
        {(!people.friendshipStatus || people.friendshipStatus === 4) && (
          <button
            onClick={() => addFriendDialog.current?.showModal()}
            className=" hover:text-slate-400  "
          >
            <BsPersonFillAdd size={24} />
          </button>
        )}
        {/* if the person status 1 and requester in that relation is the current */}
        {/* user */}
        {people.friendshipStatus === 1 &&
          people.friendshipInitiatorId === currentUserId && (
            <button
              onClick={() => rejectOrCancelFriendDialog.current?.showModal()}
              className="btn btn-sm text-lime-500"
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
                onClick={() => setOpenAcceptFriendDialog(true)}
                className="   bg-lime-500  text-zinc-950 px-2 py-1 rounded-lg mx-1"
              >
                {openAcceptFriendDialog ? "loading..." : "accept"}
              </button>

              <button
                onClick={() => rejectOrCancelFriendDialog.current?.showModal()}
                className="   bg-red-500  text-zinc-950 px-2 py-1 rounded-lg mx-1"
              >
                reject
              </button>
            </div>
          )}
        {/* if the person is already friend with the current user */}
        {/* {people.friendshipStatus === 3 && <BsPersonFillCheck size={24} />} */}
        {people.friendshipStatus !== 5 && (
          <button onClick={() => blockDialog.current?.showModal()}>
            <BsPersonFillSlash size={24} />
          </button>
        )}
      </div>

      <AddFriendDialog
        people={people}
        currentUserId={currentUserId}
        dialogRef={addFriendDialog}
      />

      <RejectOrCancelFriendRequestDialog
        RejectOrCancelDialog={
          people.friendshipInitiatorId === currentUserId ? "cancel" : "reject"
        }
        people={people}
        currentUserId={currentUserId}
        dialogRef={rejectOrCancelFriendDialog}
      />

      {openAcceptFriendDialog && (
        <AcceptFriendDialog
          people={people}
          currentUserId={currentUserId}
          setOpenAcceptFriendDialog={setOpenAcceptFriendDialog}
        />
      )}

      <BlockFriendDialog
        dialogRef={blockDialog}
        people={{
          friendId: people.personId,
          friendshipId: people.friendshipId!,
          name: people.personName,
        }}
        currentUserId={currentUserId}
      />
    </div>
  );
}
