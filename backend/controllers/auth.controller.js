import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import transporter from "../Nodemailer/nodemailer.js"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"
import { generateVerificationCode } from "../utils/generateVerificationCode.js"

export const signup = async (req, res) => {
    const { name, email, password } = req.body
    try {
        if (!name || !email || !password) {
            throw new Error("All fields are required")
        }

        const userAlreadyExists = await User.findOne({ email })
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        // hash password inside user model file - is completed

        const user = new User({
            name, email, password
        })

        await user.save()


        // send mail
        const emailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Welcome to Auth",
            text: `Thanks for Joining With Us Keep grow ${name}`
        }

        await transporter.sendMail(emailOptions)

        return res.status(201).json({
            success: true, message: "user created successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log(`Error in Signup Controller ${error.message}`)
        res.status(500).json({ message: error.message || "Failed to Register user" })
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            throw new Error("All fields are required")
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid Password" })
        }

        // jwt token
        const token = await generateTokenAndSetCookie(res, user._id)

        return res.status(200).json({
            success: true, message: "user Login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
            }
        })
    } catch (error) {
        console.log(`Error in Login Controller ${error.message}`)
        res.status(500).json({ message: "Failed to Login user" })
    }
}
export const logout = async (req, res) => {
    try {
        res.clearCookie("authauth", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0
        })
        return res.status(200).json({ success: true, message: "Logout Successfully" })
    } catch (error) {
        console.log(`Error in Logout Controller ${error.message}`)
        res.status(500).json({ message: "Failed to Logout user" })
    }
}


export const sendVerifyOtp = async (req, res) => {
    const loginUser = req.userId
    try {
        const user = await User.findById(loginUser)
        if (!user) {
            return res.status(401).json({ success: false, message: "Not Authorized! Please Login" })
        }
        if (user.isVerified) {
            return res.status(401).json({ success: false, message: "User Account Already Verified" })
        }

        // generare otp 
        const otp = generateVerificationCode()

        user.verificationToken = otp
        user.verificationTokenExpiresAt = Date.now() + 2 * 60 * 1000
        await user.save()

        // send otp
        // send mail
        const emailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Verification Account",
            text: `Verify Your Account Using this OTP ${otp}.`
        }

        await transporter.sendMail(emailOptions)

        return res.status(200).json({ success: true, message: "Account Verification OTP send to Your Email" })
    } catch (error) {
        console.log(`Error in send verify Otp Controller ${error.message}`)
        res.status(500).json({ message: "Failed to send verify email otp " })
    }
}

export const verifyAccount = async (req, res) => {
    const { otp } = req.body
    // console.log(otp)
    const loginUser = req.userId
    if (!otp) {
        return res.status(400).json({ success: false, message: "Please Enter The OTP!" })
    }
    try {

        const user = await User.findById(loginUser).select("-password")
        if (!user) {
            return res.status(401).json({ success: false, message: "Not Authorized! Please Login" })
        }
        if (user.verificationToken === "" || user.verificationToken !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP!" })
        }
        if (user.verificationTokenExpiresAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP Expired!" })
        }

        user.isVerified = true;
        user.verificationToken = null
        user.verificationTokenExpiresAt = 0

        await user.save()

        return res.status(200).json({ success: true, message: "Account Verified Successfully", user })

    } catch (error) {
        console.log(`Error in verifyAccount Controller ${error.message}`)
        res.status(500).json({ message: "Failed to verifyAccount " })
    }
}




export const sendPasswordResetOtp = async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.status(400).json({ success: false, message: "Please Enter The Email ID!" })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Email!" })
        }

        // generare otp 
        const otp = generateVerificationCode()

        user.resetPasswordToken = otp
        user.resetPasswordExpiresAt = Date.now() + 2 * 60 * 1000
        await user.save()

        // send otp
        // send mail
        const emailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "User Password Reset",
            text: `Reset Your Password Using this OTP ${otp}.`
        }

        await transporter.sendMail(emailOptions)

        return res.status(200).json({ success: true, message: "Password Reset OTP send to Your Email" })
    } catch (error) {
        console.log(`Error in send password reset Otp Controller ${error.message}`)
        res.status(500).json({ message: "Failed to send password reset otp " })
    }
}



export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body
    if (!otp || !email || !newPassword) {
        return res.status(400).json({ success: false, message: "Required All Details to Password Reset!" })
    }
    try {

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "Email not found!" })
        }
        if (user.resetPasswordToken === "" || user.resetPasswordToken !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP!" })
        }
        if (user.resetPasswordExpiresAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP Expired!" })
        }

        // hash password
        // const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = newPassword;
        user.resetPasswordToken = null
        user.resetPasswordExpiresAt = 0

        await user.save()
        // console.log("pass",user.password)

        return res.status(200).json({ success: true, message: "Password Reset Successfully" })

    } catch (error) {
        console.log(`Error in password reset Controller ${error.message}`)
        res.status(500).json({ message: "Failed to password reset " })
    }
}


export const isAuth = async (req, res) => {
    try {
        const loginUser = req.userId
        const user = await User.findById(loginUser).select("-password")
        if (!user) {
            return res.status(401).json({ success: false, message: "Not Authenticated! Please Login" })
        }


        return res.status(200).json({ success: true, user })
    } catch (error) {
        console.log(`Error in isAuthenticated Controller ${error.message}`)
        return res.status(500).json({ message: "Failed to get isAuthenticated" })
    }
}