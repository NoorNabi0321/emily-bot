import express from "express";
import dotenv from "dotenv";
import { db } from "./config/db";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Emily Bot API Online");
});

app.get("/health", (req, res) => {
  res.send("Emily Bot Running");
});

db.query("SELECT NOW()")
.then(() => {
  console.log("Database Connected");
})
.catch((err) => {
  console.error("Database Error:", err);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Emily Bot running on ${PORT}`);
});