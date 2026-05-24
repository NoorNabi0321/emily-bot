import express from "express";

const app = express();

app.get("/health", (req, res) => {
  res.send("Emily Bot Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Emily Bot running on ${PORT}`);
});