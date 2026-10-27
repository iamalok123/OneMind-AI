import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import chatRouter from "./routes/chat.route.js";

dotenv.config();


const port = process.env.PORT || 8002;
const app = express();
app.use(express.json());

app.use("/", chatRouter);

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello from Chat Service" });
});

app.listen(port, () => {
    console.log(`Chat service running on port ${port}`);
    connectDB()
});

export default app;
