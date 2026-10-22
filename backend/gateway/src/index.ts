import express, { Request, Response } from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
dotenv.config()

const port = process.env.PORT || 8000

const app = express()

const authService = process.env.AUTH_SERVICE || "http://localhost:8001"

app.use("/auth", proxy(authService))


app.get("/", (req: Request, res: Response) => {
    res.json({ message: "hello from gateway" })
})

app.listen(port, () => {
    console.log(`gateway started at ${port}`)
})
