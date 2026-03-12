import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/newsletter", (req, res) => {
  const { firstName, email } = req.body;
  console.log("Newsletter signup:", firstName, email);
  res.json({ success: true, message: "Subscribed!" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
