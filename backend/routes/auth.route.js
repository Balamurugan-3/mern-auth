import express from "express"
import {
    isAuth, login, logout, resetPassword, sendPasswordResetOtp, sendVerifyOtp,
    signup, verifyAccount
} from "../controllers/auth.controller.js"
import isAuthenticated from "../middleware/isAuthenticated.js"

const router = express.Router()

router.post("/register", signup)
router.post("/login", login)
router.post("/logout", logout)

router.post("/send-verify-otp", isAuthenticated, sendVerifyOtp)
router.post("/verify-account", isAuthenticated, verifyAccount)

router.post("/send-reset-otp", sendPasswordResetOtp)
router.post("/reset-password", resetPassword)

router.get("/getMe", isAuthenticated, isAuth)

export default router