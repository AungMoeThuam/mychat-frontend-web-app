import { Socket, io } from "socket.io-client";
import { Event } from "../utils/socketEvents";
import { socketUrl } from "../utils/backendConfig";

interface UnSubcribeEventsAndCallbacks {
  event: string;
  callback: (arg?: any) => void;
}
class SocketIO {
  static instance: SocketIO;
  io: Socket;

  subscribedEvents: string[] = [];
  constructor(url: string) {
    this.io = io(url, {
      path: "/io/",
      autoConnect: false,
      //   query: {
      //     userId: getAuth()?._id,
      //   },
    });
  }

  connect(currentUserId: string) {
    if (!this.io.active)
      this.io.connect().emit(Event.ACTIVE, { userId: currentUserId });
  }
  disconnect() {
    this.io.disconnect();
  }

  emitEvent(event: string, data?: any) {
    this.io.emit(event, data);
  }

  subscribeOneEvent(event: string, listener: (data?: any) => void) {
    this.io.on(event, listener);
  }

  unbSubcribeOneEvent(event: string, callback: (data?: any) => void) {
    this.io.off(event, callback);
  }

  unSubscribeManyEvents(listeners: UnSubcribeEventsAndCallbacks[]) {
    listeners.forEach((ev, _) => {
      this.io.off(ev.event, ev.callback);
    });
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
export default SocketIO.getInstance(socketUrl);
