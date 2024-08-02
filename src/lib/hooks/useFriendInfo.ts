import { useEffect, useState } from "react";
import { ProfilePhoto } from "../types/types";
import friendService from "../../service/friend.service";

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
        const result = await friendService.checkFriendShipStatus(
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
