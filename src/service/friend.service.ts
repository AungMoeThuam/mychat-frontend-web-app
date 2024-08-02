import { Result } from "../lib/types/types";
import { ErrorResult, SuccessResult } from "../lib/utils/resultHelperFunctions";
import API from "./api";
import { AxiosError } from "axios";
function receipentDetermintor(
  type: string,
  transactionIds: {
    currentUserId: string;
    friendId: string;
    friendshipId: string;
  }
) {
  if (type === "request")
    return {
      receipentId: transactionIds.friendId,
      requesterId: transactionIds.currentUserId,
      friendshipId: transactionIds.friendshipId,
    };

  return { friendshipId: transactionIds.friendshipId };
}
const friendService = {
  searchFriendsByName: async (
    peopleSearch: string,
    currentUserId: string
  ): Promise<Result> => {
    try {
      if (peopleSearch.trim() === "") return SuccessResult([]);

      const { data } = await API.post(
        `/users/search?name=${peopleSearch}&userId=${currentUserId}`
      );

      return SuccessResult(data);
    } catch (error) {
      return ErrorResult(error);
    }
  },

  manageFriendShipStatus: async (friendshipInfo: {
    friendId: string;
    type: "request" | "accept" | "cancelrequest" | "reject";
    currentUserId: string;
    friendshipId: string;
  }): Promise<Result> => {
    try {
      const { type, friendId, currentUserId, friendshipId } = friendshipInfo;

      const mybody = receipentDetermintor(type, {
        currentUserId,
        friendshipId,
        friendId,
      });

      const { data } = await API.post(`/friends/${type}`, mybody);

      return SuccessResult(data);
    } catch (error) {
      if (error instanceof AxiosError) console.log(error.response?.data);
      return ErrorResult(error);
    }
  },

  block: async (
    friendshipId: string,
    currentUserId: string,
    friendId: string
  ): Promise<Result> => {
    try {
      const body = { friendshipId, currentUserId, friendId };
      const { data } = await API.post("/friends/block", body);

      return SuccessResult(data);
    } catch (error) {
      return ErrorResult(error);
    }
  },
  unblock: async (
    friendshipId: string,
    currentUserId: string
  ): Promise<Result> => {
    try {
      const body = { friendshipId, currentUserId };
      const { data } = await API.post("/friends/unblock", body);

      return SuccessResult(data);
    } catch (error) {
      return ErrorResult(error);
    }
  },

  unFriend: async (friendshipId: string): Promise<Result> => {
    try {
      const mybody = { friendshipId };
      const { data } = await API.post(`/friends/unfriend`, mybody);
      return SuccessResult(data);
    } catch (error) {
      return ErrorResult(error);
    }
  },
  getPendingsList: async (currentUserId: string): Promise<Result> => {
    try {
      const { data } = await API.get(`/friends/pendings/${currentUserId}`);
      return SuccessResult(data);
    } catch (error) {
      return ErrorResult(error);
    }
  },
  getBlocksList: async (currentUserId: string): Promise<Result> => {
    try {
      const { data } = await API.get(`/friends/blocks/${currentUserId}`);
      console.log(data, "---");
      return SuccessResult(data);
    } catch (error) {
      return ErrorResult(error);
    }
  },
  getRequestsList: async (currentUserId: string): Promise<Result> => {
    try {
      const { data } = await API.get(`/friends/requests/${currentUserId}`);
      return SuccessResult(data);
    } catch (error) {
      return ErrorResult(error);
    }
  },
  getFriendsList: async (): Promise<Result> => {
    try {
      const { data } = await API.post("/friends");
      return SuccessResult(data);
    } catch (error) {
      return ErrorResult(error);
    }
  },
  checkFriendShipStatus: async (roomId: string, currentUserId: string) => {
    try {
      const { data } = await API.post(`/friends/check/friend`, {
        roomId,
        currentUserId,
      });
      console.log(data);

      return SuccessResult({ ...data, friendId: data._id });
    } catch (error) {
      if (error instanceof AxiosError) console.log(error.response?.data);
      return ErrorResult(error);
    }
  },
};

export default friendService;
