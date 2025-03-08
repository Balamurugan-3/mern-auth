import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./features/auth/authSlice"
import { authAPI } from "./features/auth/authAPI"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authAPI.reducerPath]:authAPI.reducer,
    },

    middleware:(defaultMiddleware)=>
        defaultMiddleware().concat(authAPI.middleware)
})



