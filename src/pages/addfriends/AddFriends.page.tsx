import { useNavigate, useSearchParams } from "react-router-dom";
import AddFriendCard from "../../components/friends/friendPageMain/addfriends/AddFriendCard";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../redux/store/store";
import { searchfriendNameThunk } from "../../redux/thunks/searchFriendThunks";
import { searchFriendByName } from "../../redux/slice/searchFriendSlice";

export interface People {
  createdAt: string;
  friendshipId: string;
  name: string;
  requester: string;
  status: number | undefined;
  __v: number;
  _id: string;
  profilePhoto?: {
    createdAt: string;
    mimetype: string;
    path: string;
    size: number;
  };
}

function AddFriendsPage() {
  const [searchName, setSearchName] = useState<string>("");
  const dispatch = useDispatch<StoreDispatch>();
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const currentUserId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );
  const friends = useSelector(
    (state: RootState) => state.searchFriendSlice.poepleList
  );

  const searchPeople = (e: FormEvent) => {
    e.preventDefault();
    if (!searchName.trim()) navigate("/friends/addfriends");
    else navigate(`/friends/addfriends?search=${searchName}`);
  };

  useEffect(() => {
    let search = queryParams.get("search");
    dispatch(searchfriendNameThunk(search ? search : ""));
  }, [queryParams.get("search")]);

  useEffect(() => {
    if (searchName.trim() === "") {
      dispatch(searchFriendByName([]));
      navigate("/friends/addfriends");
    }
  }, [searchName]);
  return (
    <>
      <form className="px-4 flex gap-2 items-center " onSubmit={searchPeople}>
        <input
          onChange={(e) => setSearchName(e.target.value)}
          className="input input-sm input-bordered w-full  "
          placeholder="search..."
          type="search"
          name="search"
          id="search"
        />
      </form>

      <div className="fle flex-1 flex flex-col gap-3 overflow-y-scroll px-4 pt-3 pb-5">
        {friends.length === 0 ? (
          <h1>not found! </h1>
        ) : (
          friends.map((item) => {
            return (
              <AddFriendCard
                key={item._id}
                people={{
                  ...item,
                  status: item._id === currentUserId ? 5 : item.status,
                }}
              />
            );
          })
        )}
      </div>
    </>
  );
}

export default AddFriendsPage;
