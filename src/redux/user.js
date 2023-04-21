import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  initialAuth: true,
  accessToken: null,
  displayName: null,
  providerId: null,
  providerData: [],
  photoURL: null,
  isAnonymous: false,
  uid: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, { payload }) => {
      return { ...state, ...payload, initialAuth: false };
    },
    setNickName: (state, { payload }) => {
      return { ...state, displayName: payload };
    },
    resetData: () => {
      return { ...initialState, initialAuth: false };
    },
  },
});

export const { login, resetData, setNickName } = userSlice.actions;

export const reducer = userSlice.reducer;
