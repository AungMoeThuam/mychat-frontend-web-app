import { AiFillPhone } from "react-icons/ai";
import { backendUrlWihoutApiEndpoint } from "../../../../utils/backendConfig";
import { tempCatPhoto } from "../../../../assets/temporaryProfilePhoto";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../../../redux/store/store";
import { startCall } from "../../../../redux/features/call/callSlice";

export default function ChatHeader(props: {
  profilePhotoFilePath: string | undefined;
  friendName: string | undefined;
  friendId?: string;
}) {
  const { roomId } = useParams();
  const { profilePhotoFilePath, friendName, friendId } = props;
  const dispatch = useDispatch<StoreDispatch>();
  const userId = useSelector(
    (state: RootState) => state.authSlice.currentUserId
  );
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
        <a
          // href={`/videocall/request/${friendId}`}
          // target="_blank"
          // rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            window.open(`/videocall/request/${friendId}`, "", "popup");
          }}
        >
          {/* <Link to={`call`} rel="noopener noreferrer"> */}
          <li
          // onClick={() =>
          //   dispatch(startCall({ calleeId: friendId!, callerId: userId }))
          // }
          >
            <AiFillPhone size={25} />
          </li>
        </a>
        {/* </Link> */}
      </ul>
    </header>
  );
}
