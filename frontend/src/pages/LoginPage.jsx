import React, { useState } from 'react'
import toast from "react-hot-toast";
import { useLoginUserMutation, useRegisterUserMutation } from '../store/features/auth/authAPI';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../store/features/auth/authSlice';

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()
      const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginUserMutation()

    const handleSubmit = async(e) => {
        e.preventDefault()
        const data ={email,password}
        try {
            const res = await login(data).unwrap()
            if (res) {
                toast.success("Login Successfully")
                await dispatch(setUserData(res.user))
                navigate("/")
            }
        } catch (error) {
          toast.error(error.data.message || "failed to login")
        }
    }

    return (
        <div className='w-full min-h-[calc(100vh-4rem)] p-4 flex justify-center items-center'>
            <form className="sm:w-96 w-full border border-gray-300 text-black rounded-md p-3 py-6 sm:p-6 "
                onSubmit={handleSubmit}>
                <h1 className='text-2xl text-center font-medium mb-4 text-black'>Login Account</h1>
                <div className='space-y-4'>
                    <div className='space-y-1'>
                        <label htmlFor="" className='text-blue-800 text-sm '>Email</label>
                        <input type="email" name=""  placeholder='Email' className='py-2 px-3 outline-none w-full rounded-md bg-gray-200'
                            value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className='space-y-1'>
                        <label htmlFor="" className='text-blue-800 text-sm '>Password</label>
                        <input type="password" name=""  placeholder='Password' className='py-2 px-3 outline-none w-full rounded-md bg-gray-200'
                            value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                </div>
                <Link to="/reset-password" className='text-sm mt-3 text-blue-600 underline'>Forgot Password?</Link>
                <button className="w-full py-2 bg-blue-600 text-white  font-medium mt-6 rounded-md" disabled={isLoading}>{isLoading ? "Loading..." :"Login Account"}</button>
                <p className='text-sm text-center mt-3 text-gray-600' >Don't Have an Account ? <Link to="/register" className='text-blue-900 hover:underline font-medium'> Register</Link></p>
            </form>
        </div>
    )
}

export default LoginPage