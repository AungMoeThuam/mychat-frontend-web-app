import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../../redux/store/store";
import { updateProfileImage } from "../../../redux/features/user/userSlice";
import {
  NOT_ALLOWED_IMAGE_EXTENSION_WARNING,
  UNKNOWN_ERROR,
  UPLOAD_IMAGE_FILE_SIZE_WARNING,
} from "../../../lib/constants/errorMessages";
import { allowUploadImageExtensionTypes } from "../../../lib/utils/allowImageUploadExtensionTypes";
import { tempCatPhoto } from "../../../assets/temporaryProfilePhoto";
import { API_BASE_URL } from "../../../service/api";
import userService from "../../../service/user.service";
import Button from "../../share-components/Button";

export default function UserProfilePhotoDisplayer() {
  const dispatch = useDispatch<StoreDispatch>();
  const currentUser = useSelector((state: RootState) => state.authSlice);
  const [operation, setOperation] = useState({
    loading: false,
    error: false,
    message: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  let rawPhotoSrcObject = useRef<string | null>(null);
  const uploadProfilePhoto = async () => {
    if (!photo) {
      setOperation((prev) => ({
        ...prev,
        loading: false,
        error: true,
        message: "Image is empty!",
      }));
      return;
    }
    setOperation((prev) => ({ ...prev, loading: true }));

    try {
      const result = await userService.uploadProfilePhoto(
        photo,
        currentUser.currentUserId
      );
      if (result.error) {
        setOperation((prev) => ({
          ...prev,
          error: true,
          loading: false,
          message: result.error ? result.error : UNKNOWN_ERROR,
        }));
      } else {
        dispatch(updateProfileImage(result.data.profilePhoto));
        photoRef.current!.src = `${API_BASE_URL}/resources/profiles/${result.data.profilePhoto.path}`;
        setOperation((prev) => ({ ...prev, loading: false }));
      }
    } catch (error: any) {
      if (error instanceof Error)
        return setOperation((prev) => ({
          ...prev,
          error: true,
          loading: false,
          message: error.message,
        }));

      setOperation((prev) => ({
        ...prev,
        error: true,
        loading: false,
        message: UNKNOWN_ERROR,
      }));
    }
    setPhoto(null);
  };

  const cancelSelectedImage = () => {
    setPhoto(null);
    if (photoRef && photoRef.current)
      photoRef.current.src = `${API_BASE_URL}/resources/profiles/${currentUser.profilePhoto.path}`;

    if (!rawPhotoSrcObject) URL.revokeObjectURL(rawPhotoSrcObject);
  };
  const onChangeImageInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (!allowUploadImageExtensionTypes.includes(e.target.files[0].type)) {
        setOperation((prev) => ({
          ...prev,
          error: true,
          loading: false,
          message: NOT_ALLOWED_IMAGE_EXTENSION_WARNING,
        }));
        return;
      }
      if (e.target.files[0].size > 1e8) {
        return alert(UPLOAD_IMAGE_FILE_SIZE_WARNING);
      }
      if (e.target.files && photoRef && photoRef.current) {
        let raw = e.target.files[0];
        setPhoto(raw);
        rawPhotoSrcObject.current = URL.createObjectURL(raw);
        photoRef.current.src = rawPhotoSrcObject.current;
      }
    }
  };
  useEffect(() => {
    return () => {
      if (rawPhotoSrcObject.current)
        URL.revokeObjectURL(rawPhotoSrcObject.current);
    };
  }, []);

  return (
    <>
      <img
        ref={photoRef}
        className=" aspect-auto object-cover w-40 h-40 rounded-full"
        src={
          currentUser.profilePhoto.path
            ? `${API_BASE_URL}/resources/profiles/${currentUser.profilePhoto.path}`
            : tempCatPhoto
        }
        alt="profile"
      />
      <div>
        {operation.error && (
          <h1 className=" text-red-500 font-bold">{operation.message}</h1>
        )}
      </div>
      {photo !== null ? (
        <div className=" flex gap-2 mt-2">
          {operation.loading ? (
            <h1>...uploading...</h1>
          ) : (
            <>
              <Button onClick={cancelSelectedImage} type="warning">
                cancel
              </Button>
              <Button onClick={uploadProfilePhoto}>Save</Button>
            </>
          )}
        </div>
      ) : (
        <label
          htmlFor="dropzone-file"
          className=" btn btn-sm flex flex-col  text-slate-100 dark:text-zinc-900 bg-gradient-to-r dark:from-lime-500 dark:to-teal-500 items-center justify-center border-2 border-gray-300  border-hidden rounded-lg cursor-pointer "
        >
          Change Photo
          <input
            accept="image/*"
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={onChangeImageInput}
          />
        </label>
      )}
    </>
  );
}
