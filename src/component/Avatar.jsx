import classNames from "classnames";

const AvatarWrapper = ({ children, className, size = "small", ...rest }) => (
  <div
    className={classNames(
      "flex justify-center items-center rounded-full overflow-hidden",
      className,
      {
        "h-12 w-12": size === "small",
        "h-24 w-24 text-5xl": size === "large",
        "h-36 w-36 text-7xl": size === "super",
      }
    )}
    {...rest}
  >
    {children}
  </div>
);

const Avatar = ({ photoURL, displayName, size, avatarColor }) => {
  if (photoURL) {
    return (
      <AvatarWrapper
        size={size}
        className="bg-cover"
        style={{ backgroundImage: `url(${photoURL})` }}
      />
    );
  }

  return (
    <AvatarWrapper
      size={size}
      className={`text-white`}
      style={{
        background: avatarColor ?? "black",
      }}
    >
      {displayName?.[0].toUpperCase()}
    </AvatarWrapper>
  );
};

export default Avatar;
