interface Friend {
  requester: string;
  receipent: string;
  status: number;
  history: boolean;
  friendId: string;
  roomId: string;
  name: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: string;
  deletedByReceiver: boolean;
  messageCreatedAt: string;
  active?: boolean;
  profilePhoto: ProfilePhoto;
  unreadMessageCount: number;
  friendshipId?: string;
}
interface Message {
  senderId: string;
  receiverId: string;
  roomId: string;
  content: string;
  type: string;
  deletedBySender: boolean;
  deletedByReceiver: boolean;
  createdAt: string;
  messageId: string;
  status: number;
}

interface Result {
  data: null | any;
  error: string | null;
}

interface ProfilePhoto {
  createdAt?: Date;
  mimetype?: string;
  path?: string;
  size?: number;
}

interface User {
  createdAt: string;
  name: string;
  profilePhoto?: ProfilePhoto;
  _id: string;
  status?: number;
  friendshipId?: string;
  requester?: string;
}

interface RegisterForm {
  name: String;
  email: String;
  password: String;
  confirmPassword: String;
}

interface People {
  createdAt: string;
  friendshipId: string;
  name: string;
  requester: string;
  status: number | undefined;
  __v: number;
  _id: string;
  profilePhoto?: {
    createdAt: string;
    mimetype: string;
    path: string;
    size: number;
  };
}

export type {
  Friend,
  Message,
  User,
  ProfilePhoto,
  Result,
  RegisterForm,
  People,
};
