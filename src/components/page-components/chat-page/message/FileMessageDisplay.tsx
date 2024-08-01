import { API_BASE_URL } from "../../../../service/api-setup";
import { FaFileAlt } from "react-icons/fa";

export default function FileMessageDisplay({ content }: { content: string }) {
  return (
    <a
      target="_blank"
      href={`${API_BASE_URL}/resources/chats/${content}`}
      className={`flex items-center gap-2 `}
    >
      <FaFileAlt size={35} />
      {content}
    </a>
  );
}
