import { backendUrlWihoutApiEndpoint } from "../../../utils/backendConfig";

export default function ImageMessageDisplay(props: {
  onViewImage: () => void;

  content: string;
}) {
  const { onViewImage, content } = props;
  return (
    <>
      <img
        onClick={
          // () => router.push(`/messages/image?imageId=${content}`)
          onViewImage
        }
        className=" w-48 lg:w-64 rounded-lg"
        src={`${backendUrlWihoutApiEndpoint}/resources/chats/${content}`}
        alt="cat"
      />
    </>
  );
}
