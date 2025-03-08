import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { usePasswordVerificationMutation, usePasswordVerificationOTPMutation } from '../../store/features/auth/authAPI'
import { useNavigate } from "react-router-dom"
import { IoArrowBackCircleOutline } from "react-icons/io5"

const PasswordResetPage = () => {

    const [email, setEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [resetOtp, setResetOtp] = useState("")

    const [emailSubmitted, setEmailSubmitted] = useState(false)
    const [otpSubmitted, setOtpSubmitted] = useState(false)

    const inputRefs = React.useRef([])

    const navigate = useNavigate()

    const handleIncrese = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus()
        }
    }
    const handleReverse = (e, index) => {
        if (e.key === "Backspace" && e.target.value === "" && index > 0) {
            inputRefs.current[index - 1].focus()
        }

    }
    const handlePaste = (e, index) => {
        const paste = e.clipboardData.getData("text")
        // console.log(paste)
        const pasteArray = paste.split("")
        // console.log(pasteArray)
        pasteArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char
            }
        });
    }

    const handleOtpSubmit = async (e) => {
        e.preventDefault()
        const otpArray = inputRefs.current.map((c) => c.value)
        // console.log(otpArray)
        const otp = otpArray.join("")
        // console.log(otp)
        setResetOtp(otp)
        setOtpSubmitted(true)
    }
    // api call for redux rtk

    const [passwordResetOtpAPI, { isLoading: isSending }] = usePasswordVerificationOTPMutation()
    const [passwordResetAPI, { isLoading: isSubmiting }] = usePasswordVerificationMutation()

    const handleResetPasswordOTP = async (e) => {
        e.preventDefault()
        try {
            const res = await passwordResetOtpAPI(email).unwrap()
            if (res) {
                toast.success(res.message || "Password Reset OTP Sended to your email")
                setEmailSubmitted(true)
            }
        } catch (error) {
            toast.error(error.data.message || "Failed to send Password Reset OTP")
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        const data = { email, otp: resetOtp, newPassword }
        try {
            const res = await passwordResetAPI(data).unwrap()
            if (res) {
                toast.success(res.message || "Password Reset Successfully")
                navigate("/login")
            }
        } catch (error) {
            toast.error(error.data.message || "Failed to Reset Password! Try Again")
        }
    }

    return (
        <div className='w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4'>

            {!emailSubmitted &&
                <form className='sm:w-96 w-full  bg-indigo- border sm:p-7 p-2 py-4 text-center space-y-6'
                    onSubmit={handleResetPasswordOTP}>
                    <div>
                        <h1 className='sm:text-3xl text-xl font-medium text-blue-600'>Password Reset</h1>
                        <p className='sm:text-sm text-xs text-gray-500 my-4'>Enter Email and Get the  6-digit OTP</p>
                    </div>
                    <div className="flex flex-col items-start sm:gap-2 gap-1">
                        <label htmlFor="" className='text-gray-700'>Email</label>
                        <input type="email" placeholder='Email' className='w-full px-4 py-2 rounded-md outline-none bg-gray-50'
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <button disabled={isSending} className="mt-8 py-2 cursor-pointer rounded-md bg-gradient-to-r from-blue-600 to-indigo-900 w-full text-white font-medium flex justify-center">
                        {isSending ? <div className='size-6 rounded-full border-2 border-t-0 border-r-0 animate-spin'></div>
                            : "Submit"}</button>
                </form>
            }

            {emailSubmitted && !otpSubmitted &&
                <form className='sm:w-96 w-full bg-indigo- border sm:p-7 p-2 py-4 text-center space-y-6'
                    onSubmit={handleOtpSubmit}>
                    <div>
                        <div className='text-left mb-3' onClick={()=>(setEmailSubmitted(false))}>
                            <IoArrowBackCircleOutline className="text-4xl" />
                        </div>
                        <h1 className='sm:text-3xl text-xl font-medium text-blue-600'>Account Verify OTP</h1>
                        <p className='sm:text-sm text-xs text-gray-500 my-4'>Enter the 6-digit OTP sended to your registered Email</p>
                    </div>
                    <div className="flex justify-center items-center sm:gap-2 gap-1">
                        {Array(6).fill(0).map((_, index) => (
                            <input key={index} ref={(e) => inputRefs.current[index] = e} type="text"
                                className='sm:w-12 w-10 sm:h-12 h-10 border border-red-700 rounded-md outline-none text-center' maxLength="1"
                                onInput={(e) => handleIncrese(e, index)} onKeyDown={(e) => handleReverse(e, index)} onPaste={(e) => handlePaste(e, index)} />
                        ))}
                    </div>
                    <button className="mt-8 py-2 cursor-pointer rounded-md bg-gradient-to-r from-blue-600 to-indigo-900 w-full text-white font-medium">
                        Submit</button>
                </form>
            }
            {emailSubmitted && otpSubmitted &&
                <form className='sm:w-96 w-full bg-indigo- border sm:p-7 p-2 py-4 text-center space-y-6'
                    onSubmit={handleResetPassword}>
                    <div>
                    <div className='text-left mb-3' onClick={()=>(setOtpSubmitted(false))}>
                            <IoArrowBackCircleOutline className="text-4xl" />
                        </div>
                        <h1 className='sm:text-3xl text-xl font-medium text-blue-600'>Password Reset</h1>
                        <p className='sm:text-sm text-xs text-gray-500 my-4'>Enter Your New Password</p>
                    </div>
                    <div className="flex flex-col items-start sm:gap-2 gap-1">
                        <label htmlFor="" className='text-gray-700'>New Passowrd</label>
                        <input type="text" placeholder='Password'
                            className='w-full px-4 py-2 rounded-md outline-none bg-gray-50'
                            value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <button disabled={isSubmiting} className="mt-8 py-2 cursor-pointer rounded-md bg-gradient-to-r from-blue-600 to-indigo-900 w-full text-white font-medium flex justify-center" >
                        {isSubmiting ? <div className='size-6 rounded-full border-2 border-t-0 border-r-0 animate-spin'></div>
                            : "Submit"}</button>
                </form>
            }
        </div>
    )
}

export default PasswordResetPage