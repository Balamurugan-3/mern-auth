import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const ProductRoute = () => {
    const [loading, setLoading] = useState(true)
    const { userData, isLoggedIn } = useSelector(state => state.auth)

    useEffect(() => {
        if (userData !== undefined && userData !== null) {
            setLoading(false)
        }
    }, [userData])

    if (loading) return <div className='w-screen h-screen flex items-center justify-center'>
        <div className="md:size-10 size-8 border-2 border-t-0 border-r-0 animate-spin border-green-600 rounded-full"></div>
    </div>

    return userData ? <Outlet /> : <Navigate to="/login" replace />
}
export default ProductRoute