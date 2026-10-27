import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/agent.route.js";

dotenv.config();

const port = process.env.PORT || 8003;
const app = express();

app.use(express.json());
app.use("/", router);

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello from Agent Service" });
});

app.listen(port, async () => {
    console.log(`Agent service running on port ${port}`);
    await connectDB();
});

export default app;
