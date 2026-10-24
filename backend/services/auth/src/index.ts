import express, { Request, Response } from "express"
import dotenv from "dotenv"
dotenv.config()

import connectDB from "./config/db.js"
import router from "./routes/auth.route.js"

const port = process.env.PORT || 8001

const app = express()
app.use(express.json())

app.use("/", router)

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "hello from auth" })
})

app.listen(port, () => {
    console.log(`auth started at ${port}`)
    connectDB()
})
