interface MessageDeliveryStatusProps {
  isCurrentUserTheSender: boolean;
  deliveryStatus: number;
}
export default function MessageDeliveryStatus({
  isCurrentUserTheSender,
  deliveryStatus,
}: MessageDeliveryStatusProps) {
  return (
    <span className=" self-end">
      {isCurrentUserTheSender &&
        (deliveryStatus === 0
          ? "sent"
          : deliveryStatus === 1
          ? "delivered"
          : "seen")}
    </span>
  );
}
