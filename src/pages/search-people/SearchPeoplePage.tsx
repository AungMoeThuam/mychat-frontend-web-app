import AddFriendCard from "../../components/friends/friendPageMain/addfriends/AddFriendCard";
import { FormEvent, createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../redux/store/store";
import { searchfriendNameThunk } from "../../redux/features/people/peopleThunks";
import { searchPeopleSuccess } from "../../redux/features/people/peopleSlice";

export const SearchNameContext = createContext("");
function AddFriendsPage() {
  const [searchName, setSearchName] = useState<string>("");
  const dispatch = useDispatch<StoreDispatch>();
  const currentUserId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );
  const { poepleList, loading } = useSelector(
    (state: RootState) => state.peopleSlice
  );

  const searchPeople = (e: FormEvent) => {
    e.preventDefault();
    dispatch(searchfriendNameThunk(searchName));
  };

  useEffect(() => {
    if (searchName.trim() === "") dispatch(searchPeopleSuccess([]));
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
        <SearchNameContext.Provider value={searchName}>
          <div className="fle flex-1 flex flex-col gap-3 overflow-y-scroll px-4 pt-3 pb-5">
            {poepleList.length === 0 ? (
              <h1>not found! </h1>
            ) : (
              poepleList.map((item) => {
                return (
                  <AddFriendCard
                    key={item.personId}
                    people={{
                      ...item,
                      friendshipStatus:
                        item.personId === currentUserId
                          ? 5
                          : item.friendshipStatus,
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
