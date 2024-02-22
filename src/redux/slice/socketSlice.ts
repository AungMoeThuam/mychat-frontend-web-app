// import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import getSocketIoInstance, { SocketIO } from "../../services/socket";
// import { socketUrl } from "../../utils/backendConfig";

// type SocketState = {
//   error: boolean;
//   success: boolean;
//   loading: boolean;
//   socket: SocketIO | null;
// };

// const initialState: SocketState = {
//   error: false,
//   success: false,
//   loading: false,
//   socket: null,
// };

// const socketSlice = createSlice({
//   name: "socketSlice",
//   initialState,
//   reducers: {
//     activateSocket: (state, action: PayloadAction<string>) => {},
//   },
// });

// type SocketSliceState = ReturnType<typeof socketSlice.reducer>;
// type SocketSliceActions = typeof socketSlice.actions;

// export const { activateSocket } = socketSlice.actions;
// export default socketSlice.reducer;
// export type { SocketSliceActions, SocketSliceState };
