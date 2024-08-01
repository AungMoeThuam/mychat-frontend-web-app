import { AiFillPhone, AiFillVideoCamera } from "react-icons/ai";
import { tempCatPhoto } from "../../../../assets/temporaryProfilePhoto";
import { API_BASE_URL } from "../../../../service/api-setup";

export default function ChatHeader(props: {
  profilePhotoFilePath: string | undefined;
  friendName: string | undefined;
  friendId?: string;
}) {
  const { profilePhotoFilePath, friendName, friendId } = props;

  return (
    <header className="chat-header">
      <div className="flex justify-center items-center">
        <img
          className=" object-cover w-16 h-16 bg-slate-300 avatar rounded-full shadow mr-2"
          src={
            profilePhotoFilePath
              ? `${API_BASE_URL}/resources/profiles/${profilePhotoFilePath}`
              : tempCatPhoto
          }
          alt="profile"
        />
        <div className="flex flex-col text-lg font-bold   ">
          {friendName}
          <span className=" text-sm font-normal">1 minute ago</span>
        </div>
      </div>
      <ul className="flex gap-4 items-center pr-4 ">
        <a
          onClick={(e) => {
            e.preventDefault();
            window.open(
              `/call-room-type=audio:initiate=true/${friendId}/${friendName}`,
              "",
              "popup"
            );
          }}
        >
          <AiFillPhone size={25} />
        </a>
        <a
          onClick={(e) => {
            e.preventDefault();
            window.open(
              `/call-room-type=video:initiate=true/${friendId}/${friendName}`,
              "",
              "popup"
            );
          }}
        >
          <AiFillVideoCamera size={25} />
        </a>
      </ul>
    </header>
  );
}
