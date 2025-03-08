import jwt from "jsonwebtoken"
export const generateTokenAndSetCookie = async (res, userId) => {
    //create token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
    // send token
    res.cookie("authauth", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return token
}