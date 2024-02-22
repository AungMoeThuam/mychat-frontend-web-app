const imageTypes = ["jpg", "jpeg", "png", "gif", "svg"];
const videoTypes = ["mp4", "mov", "avi", "mkv", "wmv"];

//event names
enum Event {
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
}

export { imageTypes, videoTypes, Event };
