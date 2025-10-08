import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import urls from "./routes/urls.ts"; // Remove .ts extension
import { connectDB } from "./db/database.ts"; // Remove .ts extension

dotenv.config();
const app = express();

app.use(cors()); // Use cors as a function
app.use(express.json());

app.use("/", urls);

// app.get('\*', async (req, res) => {
//     return res.status(402).json({
//         message: 'Invalid route, kindly check again!'
//     })
// })

const main = async () => {
  await connectDB();
  app.listen(5000, () => console.log("Server running on port 5000"));
};

main().catch(console.error); // Add error handling

