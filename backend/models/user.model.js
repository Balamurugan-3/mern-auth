import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    //this is store the otp check expire or not maximum 1minute only avalible that otp
    resetPasswordToken: String,
    resetPasswordExpiresAt: Number,
    verificationToken: String,
    verificationTokenExpiresAt: Number,


}, { timestamps: true , versionKey: false})

userSchema.pre("save",async function(next) {
    const user = this
    if(!user.isModified("password")){
        return next()
    }
    const hashedPassword = await bcrypt.hash(this.password,10)
    user.password = hashedPassword
    next()
})
const User = mongoose.model("User", userSchema)
export default User