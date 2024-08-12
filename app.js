import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import item from "./routes/item_route.js";
import bill from "./routes/bill_route.js";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use("*", cors({ origin: true, credentials: true }));

app.use(express.json());

app.use("/item", item);
app.use("/bill", bill);

export default app;
