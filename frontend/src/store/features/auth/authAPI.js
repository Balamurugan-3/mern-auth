import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authAPI = createApi({
    reducerPath: "authAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://mern-auth-g7l1.onrender.com/api/auth",
        credentials: "include"
    }),
    tagTypes : ["User"],

    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (data) => ({
                url: "/register",
                method: "POST",
                body: data
            }),
            providesTags: ['User']
        }),
        loginUser: builder.mutation({
            query: (data) => ({
                url: "/login",
                method: "POST",
                body: data
            }),
            providesTags: ['User']
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST"
            }),
            providesTags: ['User']
        }),
        accountVerificationOTP: builder.mutation({
            query: () => ({
                url: "/send-verify-otp",
                method: "POST"
            })
        }),
        accountVerification: builder.mutation({
            query: (otp) => ({
                url: "/verify-account",
                method: "POST",
                body: {otp}
            })
        }),
        passwordVerificationOTP: builder.mutation({
            query: (email) => ({
                url: "/send-reset-otp",
                method: "POST",
                body: {email}
            })
        }),
        passwordVerification: builder.mutation({
            query: (data) => ({
                url: "/reset-password",
                method: "POST",
                body: data
            })
        }),
        isAuth: builder.query({
            query: () => "/getMe"
        })
    })
})

export const { useRegisterUserMutation, useLoginUserMutation, useLogoutUserMutation, useIsAuthQuery,
    useAccountVerificationOTPMutation, useAccountVerificationMutation,
    usePasswordVerificationOTPMutation, usePasswordVerificationMutation
} = authAPI