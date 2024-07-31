import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    ledger: { type: mongoose.Schema.Types.ObjectId, ref: "Ledger", required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ["Given", "Taken"], required: true },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
