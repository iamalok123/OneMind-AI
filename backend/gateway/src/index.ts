import express, { Request, Response } from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
import cors from "cors"
import cookieParser from "cookie-parser"
import { protect } from "./middleware/auth.middleware.js"
import { getCurrentUser } from "./controllers/user.controller.js"
dotenv.config()

const port = process.env.PORT || 8000

const app = express()

app.use(cors({
    origin: process.env.VITE_FRONTEND_URL,
    credentials: true
}))
app.use(cookieParser())

const authService = process.env.AUTH_SERVICE || "http://localhost:8001"
app.use("/api/auth", proxy(authService))
app.get("/api/me", protect, getCurrentUser)


app.get("/", (req: Request, res: Response) => {
    res.json({ message: "hello from gateway" })
})

app.listen(port, () => {
    console.log(`gateway started at ${port}`)
})
