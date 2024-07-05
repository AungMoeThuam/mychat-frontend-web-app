import { AiFillPhone } from "react-icons/ai";
import { backendUrlWihoutApiEndpoint } from "../../../../utils/backendConfig";
import { tempCatPhoto } from "../../../../assets/temporaryProfilePhoto";

export default function ChatHeader(props: {
  profilePhotoFilePath: string | undefined;
  friendName: string | undefined;
}) {
  const { profilePhotoFilePath, friendName } = props;
  return (
    <header className="  shadow-lg   h-20 px-4 py-2 border-b-4 border-slate-100 dark:border-zinc-950 w-full flex justify-between items-center gap-2 text-zinc-900 dark:text-lime-500">
      <div className="flex justify-center items-center">
        <img
          className=" object-cover w-16 h-16 bg-slate-300 avatar rounded-full shadow mr-2"
          src={
            profilePhotoFilePath
              ? `${backendUrlWihoutApiEndpoint}/resources/profiles/${profilePhotoFilePath}`
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
        <li onClick={() => alert("this feature is not available yet!")}>
          <AiFillPhone size={25} />
        </li>
      </ul>
    </header>
  );
}
