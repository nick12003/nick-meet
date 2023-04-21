import {
  useEffect,
  useContext,
  createContext,
  useReducer,
  useCallback,
} from "react";
import { Outlet, useParams, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getDatabase,
  ref,
  get,
  update,
  push,
  child,
  remove,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  onDisconnect,
} from "firebase/database";

const generateColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);

const db = getDatabase();

const servers = {
  iceServers: [
    {
      urls: [
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
        "stun:stun.services.mozilla.com",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

const RoomContext = createContext();
RoomContext.displayName = "RoomContext";

export const useRoomContext = () => {
  const ld = useContext(RoomContext);
  return ld;
};

const initialState = {
  roomId: null,
  users: {},
  stream: null,
  currentUser: {
    displayName: null,
    photoURL: null,
    userId: null,
    micMute: false,
    videoOff: false,
    stopScreenShare: false,
  },
  drawer: {
    isOpened: false,
    isOpen: false,
    tab: null,
  },
};

const RoomReducer = (state, action) => {
  const { payload } = action;
  switch (action.type) {
    case "SET_STREAM":
      return {
        ...state,
        stream: payload,
      };
    case "JOINED_ROOM":
      return {
        ...state,
        roomId: payload.roomId,
        currentUser: {
          ...state.currentUser,
          displayName: payload.displayName,
          photoURL: payload.photoURL,
          userId: payload.userId,
        },
      };
    case "USER_JOINED":
      const isCurrentUser = state.currentUser.userId === payload.userId;
      let uJpc = undefined;
      if (state.stream && !isCurrentUser) {
        uJpc = new RTCPeerConnection(servers);
        state.stream.getTracks().forEach((track) => {
          uJpc.addTrack(track, state.stream);
        });
        const [receiverId, createId] = [
          payload.userId,
          state.currentUser.userId,
        ].sort((a, b) => a.localeCompare(b));
        if (receiverId !== state.currentUser.userId) {
          const offerRef = ref(db, `${state.roomId}/users/${receiverId}`);
          uJpc.onicecandidate = (event) => {
            if (event.candidate) {
              push(child(offerRef, "offerCandidates"), {
                ...event.candidate.toJSON(),
                userId: createId,
              });
            }
          };

          const setOffer = async () => {
            const offerDescription = await uJpc.createOffer();
            await uJpc.setLocalDescription(offerDescription);

            const offer = {
              sdp: offerDescription.sdp,
              type: offerDescription.type,
              userId: createId,
            };

            push(child(offerRef, "offers"), offer);
          };

          setOffer();
        }
      }

      return {
        ...state,
        users: {
          ...state.users,
          [payload.userId]: {
            ...payload,
            peerConnection: uJpc,
            currentUser: isCurrentUser,
          },
        },
      };
    case "USER_LEAVED":
      return {
        ...state,
        users: Object.entries(state.users).reduce((pre, [userId, userInfo]) => {
          if (userId === payload.userId) return pre;
          return {
            ...pre,
            [userId]: userInfo,
          };
        }, {}),
      };
    case "UPDATE_USER":
      if ("micMute" in payload) {
        state.stream.getAudioTracks().forEach((item) => {
          item.enabled = !payload.micMute;
        });
      }
      if ("videoOff" in payload) {
        state.stream.getVideoTracks().forEach((item) => {
          item.enabled = !payload.videoOff;
        });
      }
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          ...payload,
        },
      };
    case "UPDATE_USERS":
      return {
        ...state,
        users: Object.entries(state.users).reduce(
          (pre, [userId, userInfo]) => ({
            ...pre,
            [userId]: {
              ...userInfo,
              ...(userId === payload.userId ? payload : {}),
            },
          }),
          {}
        ),
      };
    case "RETURN_ANSWER":
      const rApc = state.users[payload.userId].peerConnection;
      rApc.setRemoteDescription(new RTCSessionDescription(payload));

      const answerRef = ref(db, `${state.roomId}/users/${payload.userId}`);
      rApc.onicecandidate = (event) => {
        if (event.candidate) {
          push(child(answerRef, "answerCandidates"), {
            ...event.candidate.toJSON(),
            userId: state.currentUser.userId,
          });
        }
      };

      const setAnswer = async () => {
        const answerDescription = await rApc.createAnswer();
        await rApc.setLocalDescription(answerDescription);

        const answer = {
          type: answerDescription.type,
          sdp: answerDescription.sdp,
          userId: state.currentUser.userId,
        };
        push(child(answerRef, "answers"), answer);
      };
      setAnswer();

      return state;
    case "SET_ANSWER":
      const sApc = state.users[payload.userId].peerConnection;
      sApc.setRemoteDescription(new RTCSessionDescription(payload));

      return state;
    case "ADD_CANDIDATES":
      const aCpc = state.users[payload.userId].peerConnection;
      aCpc.addIceCandidate(new RTCIceCandidate(payload));

      return state;
    case "OPEN_DRAWER":
      return {
        ...state,
        drawer: {
          ...payload,
          isOpen: true,
          isOpened: true,
        },
      };
    case "CLOSE_DRAWER":
      return {
        ...state,
        drawer: {
          ...state.drawer,
          isOpen: false,
        },
      };
    case "LEAVE_ROOM":
      return initialState;
  }
};

const RoomWrapper = () => {
  const [state, dispatch] = useReducer(RoomReducer, initialState);
  const params = useParams();

  const { displayName, photoURL } = useSelector((state) => state.user);

  const createStream = async (config) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        config ?? {
          audio: true,
          video: true,
        }
      );
      dispatch({
        type: "SET_STREAM",
        payload: stream,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const joinRoom = async (roomId) => {
    let roomRef;

    if (roomId) {
      const snapshot = await get(child(ref(db), roomId));
      if (!snapshot.exists()) {
        console.log("not found");
        return;
      }
      roomRef = snapshot.ref;
    } else {
      roomRef = push(ref(db));
    }
    console.log("enter room ", roomRef.key);
    const usersRef = child(roomRef.ref, "users");
    const currentAvatarColor = generateColor();
    const userRef = push(usersRef, {
      displayName,
      photoURL,
      control: {
        micMute: false,
        videoOff: false,
        stopScreenShare: false,
      },
      avatarColor: currentAvatarColor,
    });
    onDisconnect(userRef.ref).remove();

    dispatch({
      type: "JOINED_ROOM",
      payload: {
        roomId: roomRef.key,
        userId: userRef.key,
        displayName,
        photoURL,
        avatarColor: currentAvatarColor,
      },
    });

    onChildAdded(child(userRef.ref, "offers"), (snapshot) => {
      console.group("user offers");
      console.log(snapshot.key);
      console.log(snapshot.val());
      const offer = snapshot.val();
      if (offer) {
        dispatch({
          type: "RETURN_ANSWER",
          payload: offer,
        });
      }
      console.groupEnd("user offers");
    });

    onChildAdded(child(userRef.ref, "offerCandidates"), (snapshot) => {
      console.group("user offerCandidates");
      console.log(snapshot.key);
      console.log(snapshot.val());
      const candidate = snapshot.val();
      if (candidate) {
        dispatch({
          type: "ADD_CANDIDATES",
          payload: candidate,
        });
      }
      console.groupEnd("user offerCandidates");
    });

    onChildAdded(child(userRef.ref, "answers"), (snapshot) => {
      console.group("user answers");
      console.log(snapshot.key);
      console.log(snapshot.val());
      const answer = snapshot.val();
      if (answer) {
        dispatch({
          type: "SET_ANSWER",
          payload: answer,
        });
      }
      console.groupEnd("user answers");
    });

    onChildAdded(child(userRef.ref, "answerCandidates"), (snapshot) => {
      console.group("user answerCandidates");
      console.log(snapshot.key);
      console.log(snapshot.val());
      const candidate = snapshot.val();
      if (candidate) {
        dispatch({
          type: "ADD_CANDIDATES",
          payload: candidate,
        });
      }
      console.groupEnd("user answerCandidates");
    });

    onChildAdded(usersRef, (userInfo) => {
      console.group("users onChildAdded");
      console.log(userInfo.key);
      console.log(userInfo.val());
      const { control, ...rest } = userInfo.val();
      dispatch({
        type: "USER_JOINED",
        payload: {
          ...control,
          ...rest,
          userId: userInfo.key,
          avatarColor: generateColor(),
        },
      });
      onChildChanged(child(userInfo.ref, "control"), (changeSetting) => {
        console.group(userInfo.key, "onChildChanged");
        console.log(changeSetting.val());
        dispatch({
          type: "UPDATE_USERS",
          payload: {
            [changeSetting.key]: changeSetting.val(),
            userId: userInfo.key,
          },
        });
        console.groupEnd(userInfo.key, "onChildChanged");
      });
      onChildRemoved(userInfo.ref, () => {
        dispatch({
          type: "USER_LEAVED",
          payload: {
            userId: userInfo.key,
          },
        });
      });
      console.groupEnd("users onChildAdded");
    });
  };

  const changeSetting = useCallback(
    async (newSetting) => {
      dispatch({
        type: "UPDATE_USER",
        payload: newSetting,
      });
      await update(
        ref(db, `${state.roomId}/users/${state.currentUser.userId}/control`),
        newSetting
      );
    },
    [state?.roomId, state?.currentUser?.userId]
  );

  const openDrawer = (newTab) => {
    dispatch({
      type: "OPEN_DRAWER",
      payload: newTab,
    });
  };

  const closeDrawer = () => {
    dispatch({
      type: "CLOSE_DRAWER",
    });
  };

  const leavedRoom = useCallback(async () => {
    await remove(ref(db, `${state.roomId}/users/${state.currentUser.userId}`));
  }, [state?.roomId, state.currentUser?.userId]);

  useEffect(() => {
    const init = async () => {
      await createStream();
      await joinRoom(params?.roomId);
    };
    init();

    return () => {};
  }, []);

  useEffect(() => {
    return () => {
      state.stream?.getTracks().forEach((track) => track.stop());
    };
  }, [state.stream]);

  if (!params?.roomId && state.roomId) {
    return <Navigate to={`/room/${state.roomId}`} replace />;
  }

  return (
    <RoomContext.Provider
      value={{
        ...state,
        changeSetting,
        openDrawer,
        closeDrawer,
        leavedRoom,
      }}
    >
      <Outlet />
    </RoomContext.Provider>
  );
};

export default RoomWrapper;