import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "@/firebase/auth";

import Avatar from "./Avatar";

const Home = () => {
  const [input, setInput] = useState({
    text: "",
    changed: false,
  });
  const navigate = useNavigate();
  const { displayName, photoURL } = useSelector((state) => state.user);

  // console.log("render Home", displayName);
  return (
    <div className="h-full flex justify-center items-center">
      <div className="absolute top-0 right-0 flex items-center p-4 text-white">
        <button className="px-4 py-1" onClick={logout}>
          登出
        </button>
        <Avatar photoURL={photoURL} displayName={displayName} />
      </div>
      <div className="flex flex-col items-center space-y-4">
        <div>
          <button
            className="bg-primary text-xl text-white p-4 rounded-full outline-none hover:drop-shadow-primary"
            onClick={() => navigate("/room")}
          >
            建立一個新房間
          </button>
        </div>
        <div className=" text-3xl font-bold">或</div>
        <div className="text-xl font-bold flex justify-center items-center">
          <input
            type="text"
            placeholder="輸入房間ID"
            className="h-14 px-4  border-2 border-primary rounded-tl-2xl rounded-bl-2xl outline-none"
            value={input.text}
            onChange={(e) => {
              setInput((pre) => ({
                ...pre,
                text: e.target.value,
              }));
            }}
          />
          <button
            className="h-14 py-2 px-4 bg-white border-2 border-l-0 border-primary rounded-tr-2xl rounded-br-2xl outline-none hover:bg-primary hover:text-white"
            onClick={() => {
              if (input.text) {
                navigate(`/room/${input.text}`);
              }
            }}
          >
            加入
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
