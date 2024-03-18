type Friend = {
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
};
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

interface HttpResponse {
  status: string;
  message: string;
  data: any;
}

interface Result {
  data: null | any;
  error: { message: string } | null;
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
  phone: String;
  password: String;
  confirmPassword: String;
}

export type {
  Friend,
  Message,
  HttpResponse,
  User,
  ProfilePhoto,
  Result,
  RegisterForm,
};
