import { Link } from "react-router-dom";

const NotFount = () => {
  return (
    <div className="h-full flex items-center justify-center text-white relative">
      <div className="flex flex-col items-center justify-center text-center max-w-[600px]">
        <h2 className="text-9xl font-bold mb-3">404</h2>
        <h4 className="bg-white text-3xl text-primary  rounded py-3 px-5 mb-3">
          Opps! Page not found
        </h4>
        <p className="text-xl">
          The page you were looking for doesn't exist. You may have mistyped the
          address or the page may have moved.
        </p>
        <Link
          to="/"
          className="bg-[#ff0562] rounded-3xl py-3 px-6 shadow-lg mt-6 hover:scale-125 transition duration-300 ease-out"
        >
          Back To Home
        </Link>
      </div>
    </div>
  );
};

export default NotFount;
