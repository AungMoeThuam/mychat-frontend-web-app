const imageTypes = ["jpg", "jpeg", "png", "gif", "svg"];
const videoTypes = ["mp4", "mov", "avi", "mkv", "wmv"];

//event names
enum Event {
  STARTTYPING = "start-typing",
  STOPTYPING = "stop-typing",
  ACCEPT = "accept",
  REQUEST = "request",
  REJECT = "reject",
  MESSAGE = "message",
  NEWMESSAGE = "newmessage",
  ACTIVE = "active",
  DELETEMESSAGE = "deleteMessage",
  JOINROOM = "joinroom",
  NEWACTIVEUSER = "newActiveUser",
  NEWOFFLINEUSER = "newOfflineUser",
  NEWNOTIFICATION = "newNotification",
  MESSAGE_STATUS_SEEN = "message_status_seen",
  MESSAGE_STATUS_DELIVERED = "message_status_delivered",
}

export { imageTypes, videoTypes, Event };
