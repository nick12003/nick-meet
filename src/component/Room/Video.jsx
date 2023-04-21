import { useRef, useEffect } from "react";
import classNames from "classnames";

import { ReactComponent as MicMuteIcon } from "@/assets/svg/MicMute.svg";
import Avatar from "../Avatar";

const Video = ({
  stream,
  currentUser,
  displayName,
  photoURL,
  micMute,
  videoOff,
  avatarColor,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      console.log("change stream", displayName);
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="bg-black h-full min-h-[200px] relative flex justify-center items-center">
      <div className="absolute bottom-0 left-0 text-white z-10 mb-2 ml-2">
        {displayName} {currentUser && "(你)"}
      </div>
      {micMute && (
        <MicMuteIcon className="absolute top-0 right-0 text-xl text-red-500 z-10 mt-2 mr-2" />
      )}
      <div
        className={classNames(
          "h-full w-full flex justify-center items-center z-10",
          {
            absolute: videoOff,
            hidden: !videoOff,
          }
        )}
      >
        <Avatar
          photoURL={photoURL}
          displayName={displayName}
          avatarColor={avatarColor}
          size="super"
        />
      </div>
      <video
        className="h-full w-full relative object-cover"
        ref={videoRef}
        autoPlay
      />
    </div>
  );
};

export default Video;
