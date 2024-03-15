import { backendUrl } from "../utils/backendConfig";
import { ErrorResult, SuccessResult } from "../utils/resultHelperFunctions";
import { HttpResponse, Result } from "../utils/types";

const FriendShipApi = {
  searchFriendsByName: async (
    peopleSearch: string,
    currentUserId: string
  ): Promise<Result> => {
    try {
      if (peopleSearch.trim() === "") return SuccessResult([]);

      const res = await fetch(
        backendUrl +
          `/users/search?name=${peopleSearch}&userId=${currentUserId}`,
        {
          method: "POST",
        }
      );
      let result: HttpResponse = await res.json();
      if (result.status === "success") return SuccessResult(result.data);

      return ErrorResult(result.message);
    } catch (error) {
      return ErrorResult(error);
    }
  },

  manageFriendShipStatus: async (friendshipInfo: {
    relationshipStatus: number | undefined;
    id: string;
    type: "request" | "accept" | "cancelrequest" | "reject";
    currentUserId: string;
  }): Promise<{
    status: string;
    data?: any;
    errorCode?: number;
    message: string;
  }> => {
    const { type, relationshipStatus, id, currentUserId } = friendshipInfo;
    const mybody =
      relationshipStatus === 1
        ? { receipentId: currentUserId, requesterId: id }
        : { receipentId: id, requesterId: currentUserId };

    const res = await fetch(`${backendUrl}/friends/${type}`, {
      method: "POST",
      body: JSON.stringify(mybody),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    return result;
  },

  unFriend: async (friendshipInfo: {
    id: string;
    currentUserId: string;
  }): Promise<Result> => {
    try {
      const { id, currentUserId } = friendshipInfo;
      const mybody = { friendId: id, userId: currentUserId };
      const res = await fetch(`${backendUrl}/friends/unfriend`, {
        method: "POST",
        body: JSON.stringify(mybody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result: HttpResponse = await res.json();
      if (result.status === "success") return SuccessResult(result.data);
      return ErrorResult(result.message);
    } catch (error) {
      return ErrorResult(error);
    }
  },
  getPendingsList: async (currentUserId: string): Promise<Result> => {
    try {
      const res = await fetch(
        `${backendUrl}/friends/pendings/${currentUserId}`,
        {
          method: "GET",
        }
      );
      const result: HttpResponse = await res.json();

      if (result.status === "success") return SuccessResult(result.data);

      return ErrorResult(result.message);
    } catch (error) {
      return ErrorResult(error);
    }
  },
  getRequestsList: async (currentUserId: string): Promise<Result> => {
    try {
      const res = await fetch(
        `${backendUrl}/friends/requests/${currentUserId}`,
        {
          method: "GET",
        }
      );
      const result: HttpResponse = await res.json();

      if (result.status === "success") return SuccessResult(result.data);

      return ErrorResult(result.message);
    } catch (error) {
      return ErrorResult(error);
    }
  },
  getFriendsList: async (accessToken: string | null): Promise<Result> => {
    try {
      if (!accessToken) return ErrorResult("Access Token required!");
      const res = await fetch(`${backendUrl}/friends`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      const result: HttpResponse = await res.json();
      if (result.status === "success") return SuccessResult(result.data);

      return ErrorResult(result.message);
    } catch (error) {
      return ErrorResult(error);
    }
  },
  checkFriendShipStatus: async (friendId: string, roomId: string) => {
    try {
      const res = await fetch(`${backendUrl}/friends/check/friend`, {
        method: "POST",
        body: JSON.stringify({
          friendId,
          roomId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result: HttpResponse = await res.json();

      if (result.status === "success") return SuccessResult(result.data);
      return ErrorResult(result.message);
    } catch (error) {
      return ErrorResult(error);
    }
  },
};

export { FriendShipApi };
