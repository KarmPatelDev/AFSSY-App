import { createSlice } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";

const UserSlice = createSlice({
    name: "user",
    initialState: {
        data: ""
    },
    reducers:{
        changeUser(state, action){
            state.data = action.payload;
        }
    }
});

export const {changeUser} = UserSlice.actions;
export default UserSlice.reducer;