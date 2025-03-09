import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from "./components/Navbar"
import Footer from './components/Footer'
import { useIsAuthQuery } from './store/features/auth/authAPI'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from './store/features/auth/authSlice'
const App = () => {

  const dispatch = useDispatch()
  const { isLoggedIn } = useSelector(state => state.auth)

  const { data, isSuccess, isLoading } = useIsAuthQuery(undefined, {
    skip: isLoggedIn,
    refetchOnReconnect: false,
    refetchOnMountOrArgChange:true
  })

  useEffect(() => {
    if (!isLoggedIn && data && isSuccess) {
      dispatch(setUserData(data.user))
      console.log(data)
    }
  }, [data, isSuccess, dispatch])

  if (isLoading) return <div className='w-screen h-screen flex items-center justify-center'>
    <div className="md:size-10 size-8 border-2 border-t-0 border-r-0 animate-spin border-green-600 rounded-full"></div>
  </div>

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}

export default App

