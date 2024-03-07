import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../redux/store/store";
import { backendUrlWihoutApiEndpoint } from "../../utils/backendConfig";
import { Api } from "../../services/api";
import { updateProfileImage } from "../../redux/slice/authSlice";
const imageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];
export default function ImageInfo() {
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
        message: "image is empty!",
      }));
      return;
    }
    setOperation((prev) => ({ ...prev, loading: true }));

    try {
      const result = await Api.uploadProfilePhoto(
        photo,
        currentUser.currentUserId
      );
      if (result.status === "success") {
        dispatch(updateProfileImage(result.data.profilePhoto));
        photoRef.current!.src = `${backendUrlWihoutApiEndpoint}/resources/profiles/${result.data.profilePhoto.path}`;
        setOperation((prev) => ({ ...prev, loading: false }));
      } else {
        setOperation((prev) => ({
          ...prev,
          error: true,
          loading: false,
          message: result.message,
        }));
      }
    } catch (error: any) {
      setOperation((prev) => ({
        ...prev,
        error: true,
        loading: false,
        message: error.message,
      }));
    }
    setPhoto(null);
  };
  useEffect(() => {
    return () => {
      console.log("revoke - ", rawPhotoSrcObject.current);
      if (rawPhotoSrcObject.current) {
        URL.revokeObjectURL(rawPhotoSrcObject.current);
      }
    };
  }, []);

  return (
    <>
      <img
        ref={photoRef}
        className=" aspect-auto object-cover w-40 h-40 rounded-full"
        src={`${backendUrlWihoutApiEndpoint}/resources/profiles/${currentUser.profilePhoto.path}`}
        alt="profile"
      />
      <div>
        {operation.error ? (
          <h1 className=" text-red-500 font-bold">{operation.message}</h1>
        ) : (
          ""
        )}
      </div>
      {photo !== null ? (
        <div className=" flex gap-2 mt-2">
          {operation.loading ? (
            <h1>...uploading...</h1>
          ) : (
            <>
              <button
                onClick={() => {
                  setPhoto(null);
                  if (photoRef && photoRef.current)
                    photoRef.current.src = `${backendUrlWihoutApiEndpoint}/resources/profiles/${currentUser.profilePhoto.path}`;

                  if (!rawPhotoSrcObject)
                    URL.revokeObjectURL(rawPhotoSrcObject);
                }}
                className=" btn btn-sm btn-error "
              >
                cancel
              </button>
              <button
                onClick={uploadProfilePhoto}
                className="btn btn-sm btn-success"
              >
                Save
              </button>
            </>
          )}
        </div>
      ) : (
        <label
          htmlFor="dropzone-file"
          className=" btn btn-sm flex flex-col items-center justify-center border-2 border-gray-300  border-hidden rounded-lg cursor-pointer "
        >
          Change Photo
          <input
            accept="image/*"
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files[0]) {
                if (!imageTypes.includes(e.target.files[0].type)) {
                  console.log(false);
                  setOperation((prev) => ({
                    ...prev,
                    error: true,
                    loading: false,
                    message:
                      "File format should be JPG, PNG, GIF, JPEG or WebP files.",
                  }));
                  return;
                }
                if (e.target.files[0].size > 1e8) {
                  return alert("file size should not exceed 100 MB ");
                }
                if (e.target.files && photoRef && photoRef.current) {
                  let raw = e.target.files[0];
                  setPhoto(raw);
                  rawPhotoSrcObject.current = URL.createObjectURL(raw);
                  photoRef.current.src = rawPhotoSrcObject.current;
                }
              }
            }}
          />
        </label>
      )}
    </>
  );
}
