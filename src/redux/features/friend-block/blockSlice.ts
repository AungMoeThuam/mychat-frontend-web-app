import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import blockInitialState from "./blockState";
import { Friend } from "../../../lib/types/types";

const blockSlice = createSlice({
  name: "blockSlice",
  initialState: blockInitialState,
  reducers: {
    fetchBlocksListError: (
      state,
      action: PayloadAction<{ message: string }>
    ) => {
      state.error = true;
      state.message = action.payload.message;
      state.loading = false;
    },
    fetchBlocksListSuccess: (
      state,
      action: PayloadAction<{ data: Friend[]; message: string }>
    ) => {
      state.loading = false;
      state.success = true;
      state.blocksList = action.payload.data;
      state.message = action.payload.message;
    },
    fetchBlocksListLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    cancelBlockAction: (state, action: PayloadAction<string>) => {
      state.blocksList = state.blocksList.filter(
        (block) => block.friendshipId !== action.payload
      );
    },
  },
});

type BlockSliceState = ReturnType<typeof blockSlice.reducer>;
type BlockSliceAction = typeof blockSlice.actions;

export const {
  fetchBlocksListError,
  fetchBlocksListLoading,
  fetchBlocksListSuccess,
  cancelBlockAction,
} = blockSlice.actions;
export default blockSlice.reducer;
export type { BlockSliceState, BlockSliceAction };
