import { useEffect, useState } from "react";
import { ProfilePhoto } from "../utils/types";
import { FriendShipApi } from "../services/friendshipApi";
type FriendInfo = {
  name: string;
  profilePhoto: ProfilePhoto;
};

type useFriendInfoHookParams = {
  friendId: string;
  roomId: string;
  currentUserId: string;
};
export default function useFriendInfo({
  friendId,
  roomId,
  currentUserId,
}: useFriendInfoHookParams) {
  const [friendInfo, setFriendInfo] = useState<{
    error: boolean;
    data: FriendInfo | null;
  }>({ error: false, data: null });

  useEffect(() => {
    async function checkFriendShipStatus() {
      try {
        const result = await FriendShipApi.checkFriendShipStatus(
          friendId,
          roomId,
          currentUserId
        );

        if (!result.error)
          return setFriendInfo((prev) => ({ ...prev, data: result.data }));
      } catch (error: any) {
        return setFriendInfo((prev) => ({ ...prev, error: error.message }));
      }
    }
    checkFriendShipStatus();
  }, []);

  return friendInfo;
}
