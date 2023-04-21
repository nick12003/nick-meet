import { configureStore } from "@reduxjs/toolkit";

import { reducer as userReducer } from "./user";
import { reducer as roomReducer } from "./room";

const store = configureStore({
  reducer: {
    user: userReducer,
    room: roomReducer,
  },
});

export default store;
