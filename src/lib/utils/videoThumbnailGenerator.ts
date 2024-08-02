const generateVideoThumbnail = async (fileURL: File) => {
  return new Promise((res) => {
    let thumbnail: string;

    let fileReader = new FileReader();

    fileReader.addEventListener("load", listener);
    async function listener() {
      if (fileReader.result) {
        let blob = new Blob([fileReader.result], { type: fileURL.type });
        let url = URL.createObjectURL(blob);
        let video = document.createElement("video");
        let timeupdate = function () {
          if (snapImage()) {
            video.removeEventListener("timeupdate", timeupdate);
            video.pause();
          }
        };
        video.addEventListener("loadeddata", loadedDataListener);
        function loadedDataListener() {
          if (snapImage()) {
            video.removeEventListener("timeupdate", timeupdate);
            video.removeEventListener("loadeddata", loadedDataListener);
            res(thumbnail);
          }
        }
        let snapImage = function () {
          let canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          let drawer = canvas.getContext("2d");
          let success;
          if (canvas && drawer) {
            drawer.drawImage(video, 0, 0, canvas.width, canvas.height);
            let image = canvas.toDataURL();

            success = image.length > 100000;
            if (success) {
              thumbnail = image;
              URL.revokeObjectURL(url);
            }
          }

          return success;
        };
        video.addEventListener("timeupdate", timeupdate);
        video.preload = "metadata";
        video.src = url;
        // Load video in Safari / IE11
        video.muted = true;
        video.playsInline = true;
        video.play();
      }
    }
    fileReader.readAsArrayBuffer(fileURL);
  });
};

export default generateVideoThumbnail;
