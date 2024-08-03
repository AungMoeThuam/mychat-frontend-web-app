import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../../../../redux/store/store";
import { searchfriendNameThunk } from "../../../../../redux/features/people/peopleThunks";
import Modal from "../../../../share-components/Modal";
import toast from "react-hot-toast";
import { SearchNameContext } from "../../../../../pages/SearchPeople";
import { updateSearchingPeopleResult } from "../../../../../redux/features/people/peopleSlice";
import { fetchFriends } from "../../../../../redux/features/friend/friendThunks";
import { Person } from "../../../../../lib/types/types";
import friendService from "../../../../../service/friend.service";
import Button from "../../../../share-components/Button";

export default function AcceptFriendDialog({
  people,
  setOpenAcceptFriendDialog,
  currentUserId,
}: {
  people: Person;
  setOpenAcceptFriendDialog: Dispatch<SetStateAction<boolean>>;
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
      const { error } = await friendService.manageFriendShipStatus({
        friendId: people.personId,
        currentUserId,
        type: "accept",
        friendshipId: people.friendshipId!,
      });
      if (error) {
        setOperation((prev) => ({ ...prev, loading: false, error: true }));
      } else {
        toast("you have accepted a friend request ✅");
        setOpenAcceptFriendDialog(false);
        dispatch(
          updateSearchingPeopleResult({
            receipent: currentUserId,
            requester: people.personId,
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
          : () => setOpenAcceptFriendDialog(false)
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
              <Button
                onClick={() => {
                  dispatch(searchfriendNameThunk(searchNameContextConsumer));
                  setOpenAcceptFriendDialog(false);
                }}
              >
                Refresh
              </Button>
            </div>
          )
        )}
      </div>
    </Modal>
  );
}
