import { configureStore } from "@reduxjs/toolkit";

import { reducer as userReducer } from "./user";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
