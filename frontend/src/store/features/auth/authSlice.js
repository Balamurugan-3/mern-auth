import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    userData: {}
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserData: (state, action) => {
            state.isLoggedIn = true;
            state.userData = action.payload
            console.log(state.userData,state.isLoggedIn)
        },
        removeUserData: (state) => {
            state.isLoggedIn = false;
            state.userData = {}
        }
    }
})

export const { setUserData, removeUserData } = authSlice.actions;
export default authSlice.reducer