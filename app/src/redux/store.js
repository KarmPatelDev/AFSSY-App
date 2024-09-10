import { configureStore } from "@reduxjs/toolkit";
import ThemeReducer from "./ThemeSlice";
import UserReducer from "./UserSlice";

const store = configureStore({
    reducer:{
        theme:ThemeReducer,
        user:UserReducer,
    }
});

export default store;