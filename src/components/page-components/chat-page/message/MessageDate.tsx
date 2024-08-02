interface MessageDateProps {
  createdAt: string;
  previousMessageDate: null | string;
}
export default function MessageDate({
  previousMessageDate,
  createdAt,
}: MessageDateProps) {
  let prev = previousMessageDate
    ? new Date(previousMessageDate).toLocaleString().split(",")[0]
    : null;
  let cur = new Date(createdAt).toLocaleString().split(",")[0];
  return (
    <span className=" self-center ">
      {prev !== cur && new Date(createdAt).toLocaleString()}
    </span>
  );
}
