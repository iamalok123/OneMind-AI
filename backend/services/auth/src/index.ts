import express, { Request, Response } from "express"
import dotenv from "dotenv"
dotenv.config()

import connectDB from "./config/db.js"

const port = process.env.PORT || 8001

const app = express()

// Connect to MongoDB
connectDB()

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "hello from auth" })
})

app.listen(port, () => {
    console.log(`auth started at ${port}`)
})
