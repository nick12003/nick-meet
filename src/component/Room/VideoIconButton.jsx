import { useState } from "react";
import classNames from "classnames";

const VideoIconButton = ({ mute, children, onClick, tooltip }) => {
  const [hover, setHover] = useState(false);
  return (
    <button
      className={classNames(
        "relative p-3 text-white text-xl rounded-full outline-none flex justify-center items-center",
        {
          "bg-red-600 hover:bg-red-600/70 ": mute,
          "bg-slate-500 hover:bg-slate-500/70": !mute,
        }
      )}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {tooltip && hover && (
        <span className='absolute -top-1 -translate-y-full w-max text-xs animate-showToolTip'>
          {tooltip}
        </span>
      )}

      {children}
    </button>
  );
};

export default VideoIconButton;
