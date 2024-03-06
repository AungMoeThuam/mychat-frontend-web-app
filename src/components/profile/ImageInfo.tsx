import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { backendUrlWihoutApiEndpoint } from "../../utils/backendConfig";

const allowedPhotoFormat = ["jpg", "png", "gif", "webp", "jpeg"];
export default function ImageInfo() {
  const profilePhoto = useSelector(
    (state: RootState) => state.authSlice.profilePhoto
  );
  const [photo, setPhoto] = useState<File | null>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  let rawPhotoSrcObject = useRef<string | null>(null);
  const uploadProfilePhoto = () => {
    // if (photo) userApi.updateProfilePhoto(photo);

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
        src={`${backendUrlWihoutApiEndpoint}/resources/profiles/${profilePhoto.path}`}
        alt="profile"
      />

      {photo !== null ? (
        <div className=" flex gap-2 mt-2">
          <button
            onClick={() => {
              setPhoto(null);
              if (photoRef && photoRef.current)
                photoRef.current.src = `${backendUrlWihoutApiEndpoint}/resources/profiles/${profilePhoto.path}`;

              if (!rawPhotoSrcObject) URL.revokeObjectURL(rawPhotoSrcObject);
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
                if (
                  !allowedPhotoFormat.includes(
                    e.target.files[0].name.split(".")[1]
                  )
                ) {
                  alert(
                    "File format should be JPG, PNG, GIF, JPEG or WebP files."
                  );
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
