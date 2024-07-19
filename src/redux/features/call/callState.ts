export type CallState = {
  isCallExist: boolean;
  minimize: boolean;
  callInfo: {
    calleeId: string;
    callerId: string;
    callType: "video" | "audio" | "none";
    rtcPeerConnection: RTCPeerConnection | null;
    remoteStream: MediaStream | null;
    userStream: MediaStream | null;
  };
};

const callState: CallState = {
  isCallExist: false,
  minimize: false,
  callInfo: {
    calleeId: "",
    callerId: ",",
    callType: "none",
    rtcPeerConnection: null,
    remoteStream: null,
    userStream: null,
  },
};

export default callState;
