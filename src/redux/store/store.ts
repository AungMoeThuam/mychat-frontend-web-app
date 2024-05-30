import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import friendSlice from "../slices/friendSlice";
import messageSlice from "../slices/messageSlice";
import searchFriendSlice from "../slices/searchFriendSlice";
import requestSlice from "../slices/requestSlice";
import pendingSlice from "../slices/pendingSlice";
import friendshipDialogSlice from "../slices/friendshipDialogSlice";

const rootReducer = {
  authSlice,
  friendSlice,
  messageSlice,
  searchFriendSlice,
  requestSlice,
  pendingSlice,
  friendshipDialogSlice,
};
const store = configureStore({
  reducer: rootReducer,
});

type RootState = ReturnType<typeof store.getState>;
type StoreDispatch = typeof store.dispatch;
export type { RootState, StoreDispatch };
export default store;
