import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/newsletter", (req, res) => {
  const { firstName, email } = req.body;
  console.log("Newsletter signup:", firstName, email);
  res.json({ success: true, message: "Subscribed!" });
});
const PORT = process.env.PORT || 5000;

// 🚀 连接 MONGODB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Fuiyoh! 🚀 MongoDB Atlas 连接成功!"))
  .catch((error) =>
    console.log("Alamak, Database 连线失败 ❌:", error.message),
  );
  
app.listen(PORT, () => {
  console.log("✅ Backend server tengah run kat port:" + PORT);
});