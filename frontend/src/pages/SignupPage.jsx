import React, { useState } from 'react'
import toast from "react-hot-toast";
import { useRegisterUserMutation } from '../store/features/auth/authAPI';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const [register, { isLoading }] = useRegisterUserMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            name, email, password
        }
        try {
            const res = await register(data).unwrap()
            if (res) {
                toast.success("User Registered Successfully")
                navigate("/login")
            }
        } catch (error) {
            toast.error(error.data.message || "failed to register")
        }
    }

    return (
        <div className='w-full min-h-[calc(100vh-4rem)] p-4 flex justify-center items-center'>
            <form className="sm:w-96 w-full border border-gray-300 text-black rounded-md p-3 py-6 sm:p-6 "
                onSubmit={handleSubmit}>
                <h1 className='text-2xl text-center font-medium mb-4 text-black'>Create Account</h1>
                <div className='space-y-4'>
                    <div className='space-y-1'>
                        <label htmlFor="" className='text-blue-800 text-sm '>Name</label>
                        <input type="text" placeholder='Name' className='py-2 px-3 outline-none w-full rounded-md bg-gray-200'
                            value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className='space-y-1'>
                        <label htmlFor="" className='text-blue-800 text-sm '>Email</label>
                        <input type="email" placeholder='Email' className='py-2 px-3 outline-none w-full rounded-md bg-gray-200'
                            value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className='space-y-1'>
                        <label htmlFor="" className='text-blue-800 text-sm '>Password</label>
                        <input type="password" placeholder='Password' className='py-2 px-3 outline-none w-full rounded-md bg-gray-200'
                            value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                </div>
                <button className="w-full py-2 bg-blue-600 text-white  font-medium mt-6 rounded-md" disabled={isLoading}>{isLoading ? "Loading..." : "Create Account"}</button>
                <p className='text-sm text-center mt-3 text-gray-600' >Already Have an Account ? <Link to="/login" className='text-blue-900 hover:underline font-medium'> Login</Link></p>
            </form>
        </div>
    )
}

export default SignupPage