import { useState } from "react";

const IconButton = ({ children, onClick, tooltip }) => {
  const [hover, setHover] = useState(false);
  return (
    <button
      className='relative p-3 text-white text-xl rounded-full outline-none flex justify-center items-center hover:bg-slate-500/20'
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

export default IconButton;
