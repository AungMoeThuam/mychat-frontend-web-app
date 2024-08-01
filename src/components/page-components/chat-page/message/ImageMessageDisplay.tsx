import { useState } from "react";
import { backendUrlWihoutApiEndpoint } from "../../../../utils/backendConfig";
import ImageDetailDisplayDialog from "../imageDisplay/ImageDetailDisplay";

export default function ImageMessageDisplay(props: { content: string }) {
  const { content } = props;
  const [showDetail, setShowDetail] = useState(false);
  return (
    <>
      <img
        onClick={() => setShowDetail(true)}
        className=" w-48 lg:w-64 rounded-lg aspect-auto"
        src={`${backendUrlWihoutApiEndpoint}/resources/chats/${content}`}
        alt="cat"
      />
      {showDetail && (
        <ImageDetailDisplayDialog
          imageUrl={content}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
}
