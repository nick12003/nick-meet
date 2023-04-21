import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useRoomContext } from "./RoomWrapper";

import { ReactComponent as MicIcon } from "@/assets/svg/Mic.svg";
import { ReactComponent as MicMuteIcon } from "@/assets/svg/MicMute.svg";
import { ReactComponent as VideoOffIcon } from "@/assets/svg/VideoOff.svg";
import { ReactComponent as VideoIcon } from "@/assets/svg/Video.svg";
import { ReactComponent as HangUpIcon } from "@/assets/svg/HangUp.svg";

import { ReactComponent as InfoIcon } from "@/assets/svg/Info.svg";
import { ReactComponent as UsersIcon } from "@/assets/svg/Users.svg";
import { ReactComponent as ChatIcon } from "@/assets/svg/Chat.svg";

import Drawer, { Title as DrawerTitle } from "./Drawer";
import IconButton from "./IconButton";
import VideoIconButton from "./VideoIconButton";
import Video from "./Video";

const Room = () => {
  const {
    openDrawer,
    closeDrawer,
    changeSetting,
    leavedRoom,
    stream,
    drawer: { isOpen, tab },
    currentUser: { micMute, videoOff },
    currentUser,
    users,
  } = useRoomContext();

  const navigate = useNavigate();

  const handleClickTool = useCallback(
    (newTab) => {
      if (!isOpen || tab !== newTab) {
        openDrawer({
          tab: newTab,
        });
      } else {
        closeDrawer();
      }
    },
    [isOpen, tab, closeDrawer, openDrawer]
  );

  const remoteList = useMemo(() => {
    return Object.entries(users)
      .filter(([, { currentUser }]) => !currentUser)
      .map(([, userInfo]) => {
        const pc = userInfo.peerConnection;
        const remoteStream = new MediaStream();
        if (pc) {
          pc.ontrack = (event) => {
            console.log("onTrack", event);
            event.streams[0].getTracks().forEach((track) => {
              remoteStream.addTrack(track);
            });
          };
        }
        return {
          ...userInfo,
          remoteStream,
        };
      });
  }, [users]);

  return (
    <div className="h-full flex flex-col">
      <div className="h-[90vh] flex flex-grow p-4 space-x-2">
        <div className="flex items-center flex-grow">
          {remoteList.length === 0 && (
            <div className="w-full h-full">
              <Video stream={stream} currentUser {...currentUser} />
            </div>
          )}
          {remoteList.length >= 1 && remoteList.length < 4 && (
            <div className="grid grid-cols-2 gap-2 w-full h-full">
              <Video stream={stream} currentUser {...currentUser} />
              {remoteList.map(({ userId, remoteStream, ...rest }) => (
                <Video key={userId} stream={remoteStream} {...rest} />
              ))}
            </div>
          )}
          {remoteList.length >= 4 && (
            <div className="grid grid-cols-3 gap-1 w-full h-full">
              <Video stream={stream} currentUser {...currentUser} />
              {remoteList.map(({ userId, remoteStream, ...rest }) => (
                <Video key={userId} stream={remoteStream} {...rest} />
              ))}
            </div>
          )}
        </div>
        <div>
          <Drawer />
        </div>
      </div>
      <div className="flex justify-between p-4">
        <div className="text-transparent select-none">hidden</div>
        <div className="flex space-x-2">
          <VideoIconButton
            mute={micMute}
            tooltip={`${micMute ? "開啟" : "關閉"}麥克風`}
            onClick={() =>
              changeSetting({
                micMute: !micMute,
              })
            }
          >
            {micMute ? <MicMuteIcon /> : <MicIcon />}
          </VideoIconButton>
          <VideoIconButton
            mute={videoOff}
            tooltip={`${videoOff ? "開啟" : "關閉"}視訊`}
            onClick={() =>
              changeSetting({
                videoOff: !videoOff,
              })
            }
          >
            {videoOff ? <VideoOffIcon /> : <VideoIcon />}
          </VideoIconButton>
          <VideoIconButton
            mute
            tooltip="掛斷"
            onClick={async () => {
              await leavedRoom();
              navigate(`/`);
            }}
          >
            <HangUpIcon />
          </VideoIconButton>
        </div>
        <div className="flex space-x-2">
          <IconButton
            tooltip={DrawerTitle.ROOM_INFO}
            onClick={() => handleClickTool("ROOM_INFO")}
          >
            <InfoIcon />
          </IconButton>
          <IconButton
            tooltip={DrawerTitle.USERS}
            onClick={() => handleClickTool("USERS")}
          >
            <UsersIcon />
          </IconButton>
          <IconButton
            tooltip={DrawerTitle.CHAT}
            onClick={() => handleClickTool("CHAT")}
          >
            <ChatIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Room;
