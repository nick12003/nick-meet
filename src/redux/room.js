import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roomId: null,
  owner: null,
  users: [],
  userInfo: {
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

const roomSlice = createSlice({
  name: "room",
  initialState: initialState,
  reducers: {
    joinedRoom: (state, { payload }) => {
      return {
        ...state,
        roomId: payload.roomId,
        owner: payload.owner,
        users: payload.users,
        userInfo: {
          ...state.userInfo,
          userId: payload.userId,
        },
      };
    },
    userJoined: (state, { payload }) => {
      return {
        ...state,
        users: [
          ...state.users,
          {
            micMute: false,
            videoOff: false,
            stopScreenShare: false,
            ...payload,
          },
        ],
      };
    },
    userLeaved: (state, { payload }) => {
      return {
        ...state,
        ...payload,
        // users: state.users.filter(({ userId }) => userId !== payload.userId),
      };
    },
    userChangeSetting: (state, { payload }) => {
      return {
        ...state,
        users: state.users.map(({ userId, ...rest }) => ({
          userId,
          ...rest,
          ...(userId === payload.userId ? payload : {}),
        })),
      };
    },
    setUserInfo: (state, { payload }) => {
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...payload,
        },
      };
    },
    openDrawer: (state, { payload }) => {
      return {
        ...state,
        drawer: {
          ...payload,
          isOpen: true,
          isOpened: true,
        },
      };
    },
    closeDrawer: (state) => {
      return {
        ...state,
        drawer: {
          ...state.drawer,
          isOpen: false,
        },
      };
    },
    leaveRoom: () => {
      return initialState;
    },
  },
});

export const {
  joinedRoom,
  userJoined,
  userLeaved,
  userChangeSetting,
  setUserInfo,
  openDrawer,
  closeDrawer,
  leaveRoom,
} = roomSlice.actions;

export const reducer = roomSlice.reducer;
