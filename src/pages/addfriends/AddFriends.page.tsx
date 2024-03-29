import { useNavigate, useSearchParams } from "react-router-dom";
import AddFriendCard from "../../components/friends/friendPageMain/addfriends/AddFriendCard";
import { FormEvent, createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../redux/store/store";
import { searchfriendNameThunk } from "../../redux/actions/searchFriendThunks";
import { searchFriendSuccess } from "../../redux/slices/searchFriendSlice";

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

export const SearchNameContext = createContext("");
function AddFriendsPage() {
  const [searchName, setSearchName] = useState<string>("");
  const dispatch = useDispatch<StoreDispatch>();
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const currentUserId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );
  const { poepleList, loading } = useSelector(
    (state: RootState) => state.searchFriendSlice
  );
  let search = queryParams.get("search");

  const searchPeople = (e: FormEvent) => {
    e.preventDefault();
    if (!searchName.trim()) navigate("/friends/addfriends");
    else navigate(`/friends/addfriends?search=${searchName}`);
  };

  useEffect(() => {
    if (search !== null) dispatch(searchfriendNameThunk(search));
  }, [queryParams.get("search")]);

  useEffect(() => {
    if (searchName.trim() === "") dispatch(searchFriendSuccess([]));
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

      {loading ? (
        <div>loading...</div>
      ) : (
        <SearchNameContext.Provider value={search!}>
          <div className="fle flex-1 flex flex-col gap-3 overflow-y-scroll px-4 pt-3 pb-5">
            {poepleList.length === 0 ? (
              <h1>not found! </h1>
            ) : (
              poepleList.map((item) => {
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
        </SearchNameContext.Provider>
      )}
    </>
  );
}

export default AddFriendsPage;
