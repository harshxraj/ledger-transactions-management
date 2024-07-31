import express from "express";
import { authetication } from "../middlewares/authenticaton.js";
import { createLedger, getUserAllLedgers } from "../controllers/ledger.controller.js";

const ledgerRouter = express.Router();

ledgerRouter.get("/", authetication, getUserAllLedgers);
ledgerRouter.post("/", authetication, createLedger);

export default ledgerRouter;
