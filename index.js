import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/inventory_management";
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.json("shubham sinha");
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("database connection successfull");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
