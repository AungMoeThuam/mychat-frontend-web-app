import { Socket, io } from "socket.io-client";
import { Event } from "../lib/utils/socketEvents";
import { API_BASE_URL } from "./api";
import useLocalStorage from "../lib/hooks/useLocalStorage";
const { getStorage } = useLocalStorage("authToken");
class SocketIO {
  static instance: SocketIO;
  io: Socket;

  subscribedEvents: string[] = [];
  constructor(url: string) {
    this.io = io(url, {
      path: "/io/",
      autoConnect: false,
      extraHeaders: {
        Authorization: "Bearer " + getStorage().token,
      },
    });
    console.log(url);
  }

  connect(currentUserId: string) {
    if (!this.io.active)
      this.io.connect().emit(Event.ACTIVE, { userId: currentUserId });
  }
  disconnect() {
    this.io.disconnect();
  }

  emitEvent(
    event: string,
    data?: any,
    callback?: (response: { status: any }) => void
  ) {
    this.io.emit(event, data, callback);
  }

  subscribeOneEvent(event: string, listener: (data?: any) => void) {
    this.io.on(event, listener);
  }

  unbSubcribeOneEvent(event: string, callback: (data?: any) => void) {
    this.io.off(event, callback);
  }

  leaveRoom(roomId: string) {
    this.io.emit("leave_room_event", roomId);
  }

  public static getInstance(url: string): SocketIO {
    if (!SocketIO.instance) {
      SocketIO.instance = new SocketIO(url);
    }
    return SocketIO.instance;
  }
}
export { SocketIO };
export default SocketIO.getInstance(API_BASE_URL);
