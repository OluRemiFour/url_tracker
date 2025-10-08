import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import urls from "./server/routes/urls"; // Remove .ts extension
import { connectDB } from "./server/db/database"; // Remove .ts extension

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "*",
  })
); // Use cors as a function
app.use(express.json());

app.use("/", urls);

app.all(/(.*)/, (req, res, next) => {
  res.status(400).json({ message: "Invalid API url" });

  next();
});

const main = async () => {
  await connectDB();
  app.listen(5000, () => console.log("Server running on port 5000"));
};

main().catch(console.error); // Add error handling
