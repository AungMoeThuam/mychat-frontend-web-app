import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { backendUrlWihoutApiEndpoint } from "../../../../utils/backendConfig";
import Modal from "../../../modal/Modal";
import debounce from "../../../../utils/debounce";
import { Api } from "../../../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../../../redux/store/store";
import { User } from "../../../../utils/types";
import toast from "react-hot-toast";
import { searchfriendNameThunk } from "../../../../redux/thunks/searchFriendThunks";
import { tempCatPhoto } from "../../../../utils/helper";

export default function AddFriendCard({ people }: { people: User }) {
  const currentUserId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );
  const [queryParams] = useSearchParams();
  const navigate = useNavigate();
  const rejectFriendRequest = async () => {
    try {
      const { data, status } = await Api.manageFriendShipStatus({
        relationshipStatus: people.status,
        id: people._id,
        currentUserId,
        type: "reject",
      });
      if (status === "success") {
        toast("you have rejected a friend request");
      } else {
        alert(status);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };
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
      } else {
        toast(data);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };
  const action = useCallback(
    debounce(
      async (
        id: string,
        relationshipStatus: number = 0,
        process: "cancel" | "accept" = "accept"
      ) => {
        if (process === "cancel") return;

        try {
          const res = await Api.manageFriendShipStatus({
            relationshipStatus,
            type: "request",
            id,
            currentUserId,
          });
          if (res.status === "success") {
            toast("requested successfully!");
          } else {
            toast(res.message);
          }
        } catch (error) {
          console.error(error);
        }
      },
      3000
    ),
    [people._id]
  );
  const [friendShipActionDialog, setUnFriendShipActionDialog] = useState(false);
  const [test, setTest] = useState("");
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
        {!people.status && test === "" && (
          <button
            onClick={() => setUnFriendShipActionDialog(true)}
            className="btn  btn-sm hover:text-slate-400  bg-teal-500 text-black"
          >
            Add Friend
          </button>
        )}
        {people.status === 1 &&
          people.requester === currentUserId &&
          test === "" && (
            <button className=" btn btn-sm   bg-slate-700">
              cancel request
            </button>
          )}
        {people.status === 1 &&
          people.requester !== currentUserId &&
          test === "" && (
            <div>
              <button
                onClick={acceptFriendRequest}
                className=" btn btn-sm     bg-teal-500  text-slate-950"
              >
                accept request
              </button>

              <button
                onClick={rejectFriendRequest}
                className=" btn btn-sm     bg-teal-500  text-slate-950"
              >
                reject request
              </button>
            </div>
          )}

        {test === "request" && people.status !== 3 && (
          <button
            onClick={() => {
              action(people._id, 0, "cancel");
              setTest("");
            }}
            className="btn  btn-sm hover:text-slate-400  bg-teal-500 text-black"
          >
            cancel {test}
          </button>
        )}

        {people.status === 3 && "Friend"}
      </div>

      {friendShipActionDialog && (
        <AddFriendDialog
          people={people}
          currentUserId={currentUserId}
          setUnFriendShipActionDialog={setUnFriendShipActionDialog}
          searchName={queryParams.get("search")}
        />
      )}
    </div>
  );
}

function AddFriendDialog({
  people,
  setUnFriendShipActionDialog,
  currentUserId,
  searchName,
}: {
  people: User;
  setUnFriendShipActionDialog: Dispatch<SetStateAction<boolean>>;
  currentUserId: string;
  searchName: string | null;
}) {
  const dispatch = useDispatch<StoreDispatch>();
  const [operation, setOperation] = useState({
    error: false,
    loading: false,
    message: "",
    success: false,
  });
  const action = async (
    id: string,
    relationshipStatus: number = 0,
    process: "cancel" | "accept" = "accept"
  ) => {
    setOperation((prev) => ({ ...prev, loading: true }));
    if (process === "cancel") return;

    try {
      const res = await Api.manageFriendShipStatus({
        relationshipStatus,
        type: "request",
        id,
        currentUserId,
      });
      if (res.status === "success") {
        toast("requested successfully!");
        setOperation((prev) => ({ ...prev, loading: false, success: true }));
        setUnFriendShipActionDialog(false);
        dispatch(searchfriendNameThunk(searchName ? searchName : ""));
      } else {
        toast.error(res.message + " ❌❌❌", { duration: 4000 });
        setOperation((prev) => ({ ...prev, loading: false, error: true }));
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message + " ❌❌❌", { duration: 4000 });
      setOperation((prev) => ({ ...prev, loading: false, error: true }));
    }
  };

  return (
    <Modal
      onClose={
        operation.loading === true || operation.error === true
          ? () => {
              return;
            }
          : () => setUnFriendShipActionDialog(false)
      }
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col py-3 px-5 gap-10 bg-slate-950 rounded-lg shadow-lg"
      >
        {operation.loading ? (
          <h1>Loading...</h1>
        ) : operation.error ? (
          <div className="flex  justify-center gap-5 ">
            <h1>
              There is a conflict concurrent request at the moment! try refresh
            </h1>
            <button
              onClick={() => document.location.reload()}
              className=" btn btn-sm bg-teal-500 text-slate-950"
            >
              Refresh
            </button>
          </div>
        ) : (
          <>
            <h1>Are u sure to add friend to {people.name} ? </h1>
            <div className="flex  justify-center gap-5 ">
              <button
                onClick={() => {
                  action(people._id, people.status);
                }}
                className=" btn btn-sm bg-teal-500 text-slate-950"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setUnFriendShipActionDialog(false);
                }}
                className="btn  btn-sm bg-slate-900"
              >
                No
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
