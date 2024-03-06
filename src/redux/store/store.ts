import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slice/authSlice";
import friendSlice from "../slice/friendSlice";
import messageSlice from "../slice/messageSlice";
import searchFriendSlice from "../slice/searchFriendSlice";
import requestSlice from "../slice/requestSlice";
import pendingSlice from "../slice/pendingSlice";

const rootReducer = {
  authSlice,
  friendSlice,
  messageSlice,
  searchFriendSlice,
  requestSlice,
  pendingSlice,
};
const store = configureStore({
  reducer: rootReducer,
});

type RootState = ReturnType<typeof store.getState>;
type StoreDispatch = typeof store.dispatch;
export type { RootState, StoreDispatch };
export default store;
