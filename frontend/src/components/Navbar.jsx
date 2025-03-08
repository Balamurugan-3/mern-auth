import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useAccountVerificationOTPMutation, useLogoutUserMutation } from '../store/features/auth/authAPI'
import { useDispatch, useSelector } from 'react-redux'
import { removeUserData } from '../store/features/auth/authSlice'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [isMenu, setIsMenu] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isLoggedIn, userData } = useSelector((state) => state.auth)

  const [logout, { isLoading }] = useLogoutUserMutation()

  const [accountVerificationOTP, { isLoading: isSending }] = useAccountVerificationOTPMutation()

  const handleLogout = async () => {
    try {
      const res = await logout().unwrap()
      if (res) {
        toast.success("Logout Successfully")
        await dispatch(removeUserData())
        navigate("/")
      }
    } catch (error) {
      toast.error(error.data.message || "failed to logout")
    }
  }

  const handleSendOTP = async () => {
    try {
      const res = await accountVerificationOTP().unwrap()
      if (res) {
        toast.success(res.message || "Verify OTP sended to your Gmail")
        navigate("/email-verify")
      }
    } catch (error) {
      toast.error(error.data.message || "failed to send OTP")
    }
  }

  return (
    <header className='flex items-center h-16 shadow-md px-6 sm:px-8 md:px-10 bg-white'>
      <nav className="w-full flex items-center justify-between">
        <div>
         <Link to="/" className='text-xl font-medium text-blue-600'>Auth</Link>
        </div>


        {isLoggedIn ?
          <div className='relative' onClick={() => setIsMenu(!isMenu)}>
            <div className='size-11 rounded-full text-xl bg-gray-900 text-white font-medium flex justify-center items-center'>
                {userData && userData.name[0].toUpperCase()}
            </div>
            {isMenu &&
              <div className="absolute top-[100%] right-2 w-36 bg-gray-50 shadow-md text-sm
            flex flex-col rounded-md">
                {userData && !userData.isVerified &&
                  <Link className='px-4 py-2 hover:bg-gray-200 rounded-md'
                    onClick={handleSendOTP}>Account Verify</Link>
                }
                <button className='px-4 py-2 text-left hover:bg-gray-200 rounded-md' onClick={handleLogout}>Logout</button>
              </div>
            }
          </div>
          :
          <div className='flex gap-3'>
            <Link to="/register" className='py-1 px-3 border bg-blue-600 text-white font-medium rounded-md'>Signup</Link>
            <Link to="/login" className='py-1 px-3 border border-blue-600 font-medium rounded-md'>Login</Link>
          </div>
        }
      </nav>
    </header>
  )
}

export default Navbar