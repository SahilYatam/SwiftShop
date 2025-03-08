import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { redis } from "./config/redis.js";
import { app } from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB()
.then(() => {
    app.listen(PORT, async () => {
        console.log(`⚙️ Server is running at port : ${PORT}`);
        await redis.connect(console.log("Connected to Redis")).catch((error) =>console.log('Redis Client Error', error));
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})