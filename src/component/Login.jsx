import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";

import { googleLogin, githubLogin, anonymousLogin } from "@/firebase/auth";
import { setNickName } from "@/redux/user";

import { ReactComponent as GoogleIcon } from "@/assets/svg/Google.svg";
import { ReactComponent as AppleIcon } from "@/assets/svg/Apple.svg";
import { ReactComponent as GitHubIcon } from "@/assets/svg/GitHub.svg";

const LoginItem = ({ text, Icon, onClick }) => {
  return (
    <button
      className='p-2 border-2 border-primary rounded-xl outline-none flex  items-center cursor-pointer hover:bg-primary hover:text-white'
      onClick={onClick}
    >
      <div className='text-xl'>
        <Icon />
      </div>
      <div className='flex-grow text-center'>{text}</div>
    </button>
  );
};

const Login = () => {
  const [input, setInput] = useState({
    text: "",
    changed: false,
  });
  const isLogin = useSelector((state) => !!state.user.accessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("render Login", isLogin);

  if (isLogin) {
    return <Navigate to='/' />;
  }

  const loginInAnonymously = () => {
    if (!input.text) {
      setInput((pre) => ({ ...pre, changed: true }));
      return;
    }

    anonymousLogin(input.text, () => {
      dispatch(setNickName(input.text));
      navigate("/");
    });
  };

  const loginInGoogle = () => {
    googleLogin(() => {
      navigate("/");
    });
  };

  const loginInGithub = () => {
    githubLogin(() => {
      navigate("/");
    });
  };

  return (
    <div className='h-full flex justify-center items-center '>
      <div className='p-4 bg-white border-2 border-primary rounded-lg flex flex-col space-y-2 shadow-xl'>
        <h2 className='text-center text-3xl font-bold'>登入</h2>
        <div>
          <input
            type='text'
            placeholder='輸入名稱'
            maxLength={6}
            className={classNames(
              "h-12 px-4 border-2  border-primary rounded-tl-2xl rounded-bl-2xl outline-none",
              {
                "border-red-500": !input.text && input.changed,
              }
            )}
            value={input.text}
            onChange={(e) => {
              setInput((pre) => ({
                ...pre,
                text: e.target.value,
              }));
            }}
          />
          <button
            className={classNames(
              "h-12 py-2 px-4 bg-white border-2 border-l-0 border-primary rounded-tr-2xl rounded-br-2xl outline-none hover:bg-primary hover:text-white"
            )}
            onClick={loginInAnonymously}
          >
            匿名登入
          </button>
        </div>
        <div className='text-2xl font-bold text-center'>或</div>
        <div className='flex flex-col space-y-4'>
          <LoginItem text='使用Google登入' Icon={GoogleIcon} onClick={loginInGoogle} />
          <LoginItem
            text='使用Apple登入'
            Icon={AppleIcon}
            onClick={() => {
              console.log("apple");
            }}
          />
          <LoginItem text='使用Github登入' Icon={GitHubIcon} onClick={loginInGithub} />
        </div>
      </div>
    </div>
  );
};

export default Login;
