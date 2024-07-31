import express from "express";
import { authetication } from "../middlewares/authenticaton.js";
import {
  addTransaction,
  generatePdfReport,
  getAllTransactionOfLedger,
} from "../controllers/transaction.controller.js";

const transactionRouter = express.Router();

transactionRouter.post("/", authetication, addTransaction);
transactionRouter.get("/:ledgerId", authetication, getAllTransactionOfLedger);
transactionRouter.post("/pdf", authetication, generatePdfReport);

export default transactionRouter;
