import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./db/connectDB.js"
import path from "path";
//routes 
import authRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()

const __dirname = path.resolve();

//middleware for some
app.use(express.json()) // allow to get json datas
app.use(cookieParser())
app.use(cors({origin:"http://localhost:5173",credentials:true}))

app.use("/api/auth", authRoutes)

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(process.env.PORT, () => {
    console.log(`Server started to PORT ${process.env.PORT} in ${process.env.NODE_ENV}`)
    connectDB()
})