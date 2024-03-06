import { backendUrl } from "../utils/backendConfig";

const Api = {
  searchFriendsByName: async (peopleSearch: string, currentUserId: string) => {
    if (peopleSearch.trim() == "") return { data: [] };
    const res = await fetch(
      backendUrl + `/users/search?name=${peopleSearch}&userId=${currentUserId}`,
      {
        method: "POST",
      }
    );
    let result = await res.json();

    return result;
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

  unFriend: async (friendshipInfo: { id: string; currentUserId: string }) => {
    const { id, currentUserId } = friendshipInfo;
    const mybody = { friendId: id, userId: currentUserId };
    const res = await fetch(`${backendUrl}/friends/unfriend`, {
      method: "POST",
      body: JSON.stringify(mybody),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    return result;
  },
  getPendingsList: async (currentUserId: string) => {
    const res = await fetch(`${backendUrl}/friends/pendings/${currentUserId}`, {
      method: "GET",
    });
    const result = await res.json();

    return result;
  },
  getRequestsList: async (currentUserId: string) => {
    const res = await fetch(`${backendUrl}/friends/requests/${currentUserId}`, {
      method: "GET",
    });
    const result = await res.json();

    return result;
  },
};

export { Api };
