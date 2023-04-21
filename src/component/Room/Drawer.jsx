import classNames from "classnames";

import { useRoomContext } from "./RoomWrapper";

import { ReactComponent as MicMuteIcon } from "@/assets/svg/MicMute.svg";
import { ReactComponent as VideoOffIcon } from "@/assets/svg/VideoOff.svg";

import { ReactComponent as CloseIcon } from "@/assets/svg/Close.svg";
import { ReactComponent as CopyIcon } from "@/assets/svg/Copy.svg";
import { ReactComponent as SendIcon } from "@/assets/svg/Send.svg";

import Avatar from "../Avatar";

export const Title = {
  ROOM_INFO: "房間資訊",
  USERS: "使用者列表",
  CHAT: "聊天室",
};

const Drawer = () => {
  const {
    closeDrawer,
    drawer: { isOpened, isOpen, tab },
    users,
    currentUser,
    ...roomInfo
  } = useRoomContext();

  return (
    <div
      className={classNames(
        "h-full w-0 flex flex-col bg-white rounded-md duration-200 overflow-hidden",
        {
          "animate-showDrawer": isOpened && isOpen,
          "animate-hideDrawer": isOpened && !isOpen,
        }
      )}
    >
      <div className="flex px-4 py-6">
        <div>{Title[tab]}</div>
        <button
          className="text-xl ml-auto hover:text-primary"
          onClick={() => closeDrawer()}
        >
          <CloseIcon />
        </button>
      </div>
      <div className="flex flex-col flex-grow p-4">
        {tab === "ROOM_INFO" && (
          <div className="flex flex-col space-y-4">
            <div>{`房間ID : ${roomInfo.roomId}`}</div>
            <div
              className="w-max flex items-center text-blue-600 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(roomInfo.roomId);
              }}
            >
              <CopyIcon />
              複製ID
            </div>
          </div>
        )}
        {tab === "USERS" && (
          <div className="flex flex-col space-y-2">
            {Object.entries(users).map(
              ([
                userId,
                { photoURL, displayName, micMute, stopScreenShare, videoOff },
              ]) => {
                return (
                  <div className="flex items-center space-x-3" key={userId}>
                    <Avatar photoURL={photoURL} displayName={displayName} />
                    <div>
                      {displayName} {userId === currentUser.userId && "(You)"}
                    </div>
                    <div className="flex items-center justify-end space-x-3 text-slate-500 flex-grow">
                      {micMute && <MicMuteIcon />}
                      {videoOff && <VideoOffIcon />}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
        {tab === "CHAT" && (
          <>
            <div className="flex-grow"></div>
            <div className="flex items-center relative">
              <input
                type="text"
                placeholder="傳送訊息給所有人"
                className=" w-full px-4 py-2 bg-slate-200 outline-none rounded-2xl relative"
              />
              <button className="absolute right-0 -translate-x-1/2 text-2xl cursor-pointer hover:text-primary">
                <SendIcon />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Drawer;
