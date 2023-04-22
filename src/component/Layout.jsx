import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { onAuthStateChange } from "@/firebase/auth";
import { login, resetData } from "@/redux/user";

import Loading from "./Loading";

const Layout = () => {
  const initialAuth = useSelector((state) => state.user.initialAuth);
  const dispatch = useDispatch();

  // console.log("render Layout");

  useEffect(() => {
    const listen = onAuthStateChange(
      (user) => {
        const {
          accessToken,
          displayName,
          providerId,
          providerData,
          photoURL,
          isAnonymous,
          uid,
          avatarColor,
        } = user;
        dispatch(
          login({
            accessToken,
            displayName,
            providerId,
            providerData,
            photoURL,
            isAnonymous,
            uid,
            avatarColor,
          })
        );
      },
      () => {
        dispatch(resetData());
      }
    );

    return () => {
      listen();
    };
  }, []);

  return (
    <div className="h-screen w-screen text-primary  bg-gradient-radial from-primary/40 from-5% via-primary/60 via-20% to-primary to-90%">
      {initialAuth ? <Loading /> : <Outlet />}
    </div>
  );
};

export default Layout;
