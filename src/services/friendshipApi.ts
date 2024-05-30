import { ErrorResult, SuccessResult } from "../utils/resultHelperFunctions";
import { Result } from "../utils/types";
import API from "./api-setup";

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
    relationshipStatus: number | undefined;
    id: string;
    type: "request" | "accept" | "cancelrequest" | "reject";
    currentUserId: string;
  }): Promise<Result> => {
    try {
      const { type, relationshipStatus, id, currentUserId } = friendshipInfo;
      const mybody =
        relationshipStatus === 1
          ? { receipentId: currentUserId, requesterId: id }
          : { receipentId: id, requesterId: currentUserId };

      const { data } = await API.post(`/friends/${type}`, mybody);

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
