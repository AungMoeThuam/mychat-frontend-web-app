import { useState } from "react";
import ImageDetailDisplayDialog from "../imageDisplay/ImageDetailDisplay";
import { API_BASE_URL } from "../../../../service/api-setup";

export default function ImageMessageDisplay(props: { content: string }) {
  const { content } = props;
  const [showDetail, setShowDetail] = useState(false);
  return (
    <>
      <img
        onClick={() => setShowDetail(true)}
        className=" w-48 lg:w-64 rounded-lg aspect-auto"
        src={`${API_BASE_URL}/resources/chats/${content}`}
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
