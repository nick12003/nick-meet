import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Auth = () => {
  const isLogin = useSelector((state) => !!state.user.accessToken);
  // console.log("render Auth", isLogin);

  if (!isLogin) {
    return <Navigate to='/Login' />;
  }

  return <Outlet />;
};

export default Auth;
