import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Ledger = mongoose.model("Ledger", ledgerSchema);
export default Ledger;
