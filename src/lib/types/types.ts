export interface ProfilePhoto {
  createdAt?: Date;
  mimetype?: string;
  path?: string;
  size?: number;
}

export interface Friend {
  friendshipId: string;
  friendshipStatus: number;
  friendId: string;
  friendName: string;
  lastMessageContent: string;
  lastMessageType: string;
  lastMessageCreatedAt: string;
  lastMessageSenderId: string;
  lastMessageReceiverId: string;
  isTheLastMessageDeletedByReceiver: boolean;
  isActiveNow: boolean;
  profilePhoto: ProfilePhoto;
  unreadMessageCount: number;
}

export interface Person {
  personId: string;
  personName: string;
  friendshipId: string | undefined;
  friendshipStatus: number | undefined;
  friendshipReceiverId: string | undefined;
  friendshipInitiatorId: string | undefined;
  profilePhoto: ProfilePhoto | null;
}

export interface User {
  name: string;
  profilePhoto: ProfilePhoto | null;
  id: string;
  isActiveNow: boolean;
  email: string;
  phone: string | undefined;
}

export interface Message {
  senderId: string;
  receiverId: string;
  friendshipId: string;
  content: string;
  type: string;
  isDeletedByReceiver: boolean;
  createdAt: string;
  messageId: string;
  deliveryStatus: number;
}

export interface Result {
  data: null | any;
  error: string | null;
}

export interface RegisterForm {
  name: String;
  email: String;
  password: String;
  confirmPassword: String;
}
