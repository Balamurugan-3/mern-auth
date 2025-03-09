import React from 'react'
import { useSelector } from 'react-redux'
import icon from "../../assets/robo.jpg"
const Home = () => {
  const { userData } = useSelector(state => state.auth)
  return (
    <div className='flex justify-center items-center min-h-[calc(100vh-4rem) p-3]'>
      <div className='text-center space-y-4 max-w-md'>
        <img src={icon} alt="" className='mx-auto size-30' />
        <h1 className='md:text-4xl text-2xl font-bold'>👋 Welcome, {userData && userData.name || "User"}! <br/> <span className='text-lg font-medium italic'>🎉 Hope you have an amazing day! 🚀😊</span></h1>
        <p>Don’t wait for perfection, start building 🏗️ and improve 🚀 along the way! 💡🔥</p>
      </div>

    </div>
  )
}

export default Home