import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/user/userSlice";
import friendSlice from "../features/friend/friendSlice";
import messageSlice from "../features/message/messageSlice";
import peopleSlice from "../features/people/peopleSlice";
import requestSlice from "../features/friend-request/requestSlice";
import pendingSlice from "../features/friend-pending/pendingSlice";
import friendshipDialogSlice from "../slices/friendshipDialogSlice";
import blockSlice from "../features/friend-block/blockSlice";
import callSlice from "../features/call/callSlice";

const rootReducer = {
  authSlice,
  friendSlice,
  messageSlice,
  peopleSlice,
  requestSlice,
  pendingSlice,
  friendshipDialogSlice,
  blockSlice,
  callSlice,
};
const store = configureStore({
  reducer: rootReducer,
});

type RootState = ReturnType<typeof store.getState>;
type StoreDispatch = typeof store.dispatch;
export type { RootState, StoreDispatch };
export default store;
