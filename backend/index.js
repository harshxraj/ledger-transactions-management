import express from "express";
import cors from "cors";
import path from "path";

import connection from "./db/connection.js";
import authRoute from "./routes/auth.routes.js";
import ledgerRouter from "./routes/ledger.routes.js";
import transactionRouter from "./routes/transaction.routes.js";

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/auth", authRoute);
app.use("/ledger", ledgerRouter);
app.use("/transaction", transactionRouter);

app.use("/", () => {
  console.log("Hello");
});

app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});

app.listen(PORT, () => {
  connection();
  console.log(`Listening on port ${PORT}`);
});
