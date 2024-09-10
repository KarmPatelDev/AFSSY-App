import { createSlice } from "@reduxjs/toolkit";

export const ThemeSlice = createSlice({
    name: "theme",
    initialState:{
        data:"light"
    },
    reducers:{
        changeTheme(state, action){
            state.data = action.payload;
        }
    }
});

export const {changeTheme} = ThemeSlice.actions;
export default ThemeSlice.reducer;