import jwt from "jsonwebtoken"

const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.authauth
    // console.log("token",req.cookies.authauth)
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authenticated! Please Login" })
    }

    try {

        const decode = await jwt.verify(token, process.env.JWT_SECRET)

        if (!decode.id) {
            return res.status(401).json({ success: false, message: "Not Authenticated! Please Login" })
        }

        req.userId = decode.id
        next()

    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed! Please Login" })
    }
}

export default isAuthenticated