import { PayloadAction } from "@reduxjs/toolkit";
import { CallState } from "./callState";

const callReducers = {
  create: function (state: CallState, action: PayloadAction) {
    state.callInfo.rtcPeerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
          ],
        },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    });
  },
  startCall: function (
    state: CallState,
    action: PayloadAction<{ calleeId: string; callerId: string }>
  ) {
    state.isCallExist = true;
    state.callInfo.rtcPeerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
          ],
        },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    });
  },
  endCall: function (state: CallState) {
    state.isCallExist = false;
  },
  minimizeCallWindow: function (state: CallState) {
    state.minimize = true;
  },
};

export default callReducers;
