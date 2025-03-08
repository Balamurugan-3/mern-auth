import React from 'react'
import { createBrowserRouter } from "react-router-dom"
import App from '../App'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import Home from "../pages/home/Home"
import AccountVerify from '../pages/accountVerification/AccountVerify'
import ProductRoute from '../components/ProductRoute'
import PasswordResetPage from '../pages/PasswordReset/PasswordResetPage'
import NotFoundPage from '../pages/NotFoundPage'

export const router = createBrowserRouter([
    {
        path: "/", element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: "/register", element: <SignupPage /> },
            { path: "/login", element: <LoginPage /> },
            {
                element: <ProductRoute />, children: [
                    { path: "/reset-password", element: <PasswordResetPage /> },
                    { path: "/email-verify", element: <AccountVerify /> },
                ]
            },
            { path: "*", element: <NotFoundPage /> } 
        ]
    },

])
