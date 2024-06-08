import { ErrorResult, SuccessResult } from "../utils/resultHelperFunctions";
import { Result } from "../utils/constants/types";
import API from "./api-setup";
function receipentDetermintor(
  type: "request" | "accept" | "cancelrequest" | "reject" | "block" | "unblock",
  transactionIds: {
    currentUserId: string;
    friendId: string;
  }
) {
  let currentUserIsTheReceivererActions = ["accept", "reject"];

  if (currentUserIsTheReceivererActions.includes(type))
    return {
      receipentId: transactionIds.currentUserId,
      requesterId: transactionIds.friendId,
    };
  return {
    receipentId: transactionIds.friendId,
    requesterId: transactionIds.currentUserId,
  };
}
const FriendShipApi = {
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
    type:
      | "request"
      | "accept"
      | "cancelrequest"
      | "reject"
      | "block"
      | "unblock";
    currentUserId: string;
  }): Promise<Result> => {
    try {
      const { type, friendId, currentUserId } = friendshipInfo;

      const mybody = receipentDetermintor(type, {
        currentUserId,
        friendId,
      });

      console.log(mybody);

      const { data } = await API.post(`/friends/${type}`, mybody);

      return SuccessResult(data);
    } catch (error) {
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

  unFriend: async (friendshipInfo: {
    id: string;
    currentUserId: string;
  }): Promise<Result> => {
    try {
      const { id, currentUserId } = friendshipInfo;
      const mybody = { friendId: id, userId: currentUserId };
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
  checkFriendShipStatus: async (
    friendId: string,
    roomId: string,
    currentUserId: string
  ) => {
    try {
      const { data } = await API.post(`/friends/check/friend`, {
        friendId,
        roomId,
        currentUserId,
      });

      return SuccessResult(data);
    } catch (error) {
      return ErrorResult(error);
    }
  },
};

export { FriendShipApi };
