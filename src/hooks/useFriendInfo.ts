import { useEffect, useState } from "react";
import { ProfilePhoto } from "../utils/constants/types";
import { FriendShipApi } from "../service/friend-api-service";

type FriendInfo = {
  name: string;
  profilePhoto: ProfilePhoto;
  friendId: string;
};

type useFriendInfoHookParams = {
  roomId: string;
  currentUserId: string;
};
export default function useFriendInfo({
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
          roomId,
          currentUserId
        );
        console.log(result.data);

        if (!result.error)
          return setFriendInfo((prev) => ({ ...prev, data: result.data }));
      } catch (error: any) {
        return setFriendInfo((prev) => ({ ...prev, error: error.message }));
      }
    }
    checkFriendShipStatus();
  }, [roomId]);

  return friendInfo;
}
