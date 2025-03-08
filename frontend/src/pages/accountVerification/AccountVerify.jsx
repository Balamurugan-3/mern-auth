import React from 'react'
import toast from 'react-hot-toast'
import { useAccountVerificationMutation, useAccountVerificationOTPMutation } from '../../store/features/auth/authAPI'
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import {setUserData} from "../../store/features/auth/authSlice"
const AccountVerify = () => {

    const inputRefs = React.useRef([])

    const dispatch = useDispatch()

    const { userData } = useSelector(state => state.auth)

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
        const otp = pasteArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char
            }
        });
    }

    const [accountVerification, { isLoading }] = useAccountVerificationMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const otpArray = inputRefs.current.map((c) => c.value)
        // console.log(otpArray)
        const otp = otpArray.join("")
        // console.log(otp)

        try {
            const res = await accountVerification(otp).unwrap()
            if (res) {
                await dispatch(setUserData(res.user))
                navigate("/")
                toast.success(res.message || "Account Verification Completed Successfully")
            }
        } catch (error) {
            toast.error(error.data.message || "failed to send OTP")
        }
    }
    // 123456

    return (
        <div className='w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4'>
            <form className='sm:w-96 w-full -full bg-indigo- border sm:p-7 p-2 py-4 text-center space-y-6'
                onSubmit={handleSubmit}>
                <div>
                    <h1 className='sm:text-3xl text-xl font-medium text-blue-600'>Account Verify OTP</h1>
                    <p className='sm:text-sm text-xs text-gray-500 my-4'>Enter the 6-digit OTP sended to your registered Email</p>
                </div>
                <div className="flex justify-center items-center sm:gap-2 gap-1">
                    {Array(6).fill(0).map((_, index) => (
                        <input key={index} ref={(e) => inputRefs.current[index] = e} type="text"
                            className='sm:w-12 w-10 sm:h-12 h-10 border border-red-700 outline-none rounded-md text-center' maxLength="1"
                            onInput={(e) => handleIncrese(e, index)} onKeyDown={(e) => handleReverse(e, index)} onPaste={(e) => handlePaste(e, index)} />
                    ))}
                </div>
                <button className="mt-8 py-2 cursor-pointer rounded-md bg-gradient-to-r from-blue-600 to-indigo-900 w-full text-white font-medium">Submit</button>
            </form>

        </div>
    )
}

export default AccountVerify