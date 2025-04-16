import express from "express";
import mongoose from "mongoose";
import todoRoutes from "./routes/todoRoutes";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = "mongodb://localhost:27017/todoapp";

app.use(cors());

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use(express.json());

// Mount todo routes
app.use("/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
