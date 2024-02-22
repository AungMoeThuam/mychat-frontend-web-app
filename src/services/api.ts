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
  }) => {
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
};

export { Api };
