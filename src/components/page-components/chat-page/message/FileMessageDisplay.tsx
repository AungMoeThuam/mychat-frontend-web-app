import { backendUrlWihoutApiEndpoint } from "../../../../utils/backendConfig";
import { FaFileAlt } from "react-icons/fa";

export default function FileMessageDisplay({ content }: { content: string }) {
  return (
    <a
      target="_blank"
      href={`${backendUrlWihoutApiEndpoint}/resources/chats/${content}`}
      className={`flex items-center gap-2 text-slate-900`}
    >
      <FaFileAlt size={35} />
      {content}
    </a>
  );
}
