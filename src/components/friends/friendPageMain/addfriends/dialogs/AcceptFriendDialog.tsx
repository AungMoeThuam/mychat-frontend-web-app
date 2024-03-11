import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../../../../../utils/types";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../../../../redux/store/store";
import { FriendShipApi } from "../../../../../services/friendshipApi";
import { searchfriendNameThunk } from "../../../../../redux/actions/searchFriendThunks";
import Modal from "../../../../global-components/modal/Modal";
import toast from "react-hot-toast";
import { RelationshipActionDialogs } from "../AddFriendCard";
import { SearchNameContext } from "../../../../../pages/addfriends/AddFriends.page";
import { updateSearchFriends } from "../../../../../redux/slices/searchFriendSlice";
import { getFriendsListThunk } from "../../../../../redux/actions/friendThunks";

export default function AcceptFriendDialog({
  people,
  setOpenAcceptFriendDialog,
  currentUserId,
}: {
  people: User;
  setOpenAcceptFriendDialog: Dispatch<
    SetStateAction<RelationshipActionDialogs>
  >;
  currentUserId: string;
}) {
  const searchNameContextConsumer = useContext(SearchNameContext);
  const dispatch = useDispatch<StoreDispatch>();

  const [operation, setOperation] = useState({
    error: false,
    loading: false,
    message: "",
    success: false,
  });

  const acceptFriendRequest = async () => {
    setOperation((prev) => ({ ...prev, loading: true }));
    try {
      const { status } = await FriendShipApi.manageFriendShipStatus({
        relationshipStatus: people.status,
        id: people._id,
        currentUserId,
        type: "accept",
      });
      if (status === "success") {
        toast("you have accepted a friend request ✅");
        setOpenAcceptFriendDialog((prev) => ({
          ...prev,
          openAcceptFriendDialog: false,
        }));
        dispatch(
          updateSearchFriends({
            receipent: currentUserId,
            requester: people._id,
            status: 3,
          })
        );
        dispatch(getFriendsListThunk());
      } else {
        setOperation((prev) => ({ ...prev, loading: false, error: true }));
      }
    } catch (error: any) {
      toast(error.message + "❌");
      setOperation((prev) => ({ ...prev, loading: false, error: true }));
    }
  };

  useEffect(() => {
    acceptFriendRequest();
  }, []);

  return (
    <Modal
      onClose={
        operation.loading === true || operation.error === true
          ? () => {
              return;
            }
          : () =>
              setOpenAcceptFriendDialog((prev) => ({
                ...prev,
                openAcceptFriendDialog: false,
              }))
      }
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col py-3 px-5 gap-10 bg-slate-950 rounded-lg shadow-lg"
      >
        {operation.loading ? (
          <h1>loading...</h1>
        ) : (
          operation.error && (
            <div className="flex  justify-center gap-5 ">
              <h1>
                There is a conflict concurrent request at the moment! try
                refresh
              </h1>
              <button
                onClick={() => {
                  dispatch(searchfriendNameThunk(searchNameContextConsumer));
                  setOpenAcceptFriendDialog((prev) => ({
                    ...prev,
                    openAcceptFriendDialog: false,
                  }));
                }}
                className=" btn btn-sm bg-teal-500 text-slate-950"
              >
                Refresh
              </button>
            </div>
          )
        )}
      </div>
    </Modal>
  );
}
