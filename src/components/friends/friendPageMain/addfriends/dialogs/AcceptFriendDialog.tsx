import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../../../../../utils/constants/types";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../../../../redux/store/store";
import { FriendShipApi } from "../../../../../service/friend-api-service";
import { searchfriendNameThunk } from "../../../../../redux/features/people/peopleThunks";
import Modal from "../../../../share-components/modal/Modal";
import toast from "react-hot-toast";
import { RelationshipActionDialogs } from "../AddFriendCard";
import { SearchNameContext } from "../../../../../pages/search-people/SearchPeoplePage";
import { updateSearchingPeopleResult } from "../../../../../redux/features/people/peopleSlice";
import { fetchFriends } from "../../../../../redux/features/friend/friendThunks";

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
      const { error } = await FriendShipApi.manageFriendShipStatus({
        friendId: people._id,
        currentUserId,
        type: "accept",
      });
      if (error) {
        setOperation((prev) => ({ ...prev, loading: false, error: true }));
      } else {
        toast("you have accepted a friend request ✅");
        setOpenAcceptFriendDialog((prev) => ({
          ...prev,
          openAcceptFriendDialog: false,
        }));
        dispatch(
          updateSearchingPeopleResult({
            receipent: currentUserId,
            requester: people._id,
            status: 3,
          })
        );
        dispatch(fetchFriends());
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
