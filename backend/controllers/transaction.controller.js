import Ledger from "../models/ledger.model.js";
import Transaction from "../models/transaction.model.js";
import { generatePdf } from "../utils/pdfGenerator.js";

export const addTransaction = async (req, res) => {
  try {
    const { ledgerId, amount, date, type } = req.body;
    const userId = req.userId;

    const ledger = await Ledger.findOne({ _id: ledgerId, user: userId });
    console.log(ledger);
    if (!ledger) {
      return res.status(404).json({ message: "Ledger not found or does not belong to the user" });
    }

    const transaction = new Transaction({ ledger: ledgerId, amount, date, type });
    await transaction.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTransactionOfLedger = async (req, res) => {
  const { ledgerId } = req.params;
  const { startDate, endDate } = req.query;
  console.log(startDate, endDate);
  console.log(new Date(startDate));

  try {
    let query = { ledger: ledgerId };
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const transactions = await Transaction.find(query).sort({ date: "asc" });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generatePdfReport = async (req, res) => {
  try {
    const { ledgerId, startDate, endDate } = req.body;

    // Fetch ledger information
    const ledger = await Ledger.findById(ledgerId);
    if (!ledger) {
      return res.status(404).json({ message: "Ledger not found" });
    }

    // Fetch transactions within the date range
    const transactions = await Transaction.find({
      ledger: ledgerId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).sort({ date: "asc" });

    // Generate PDF
    const pdfBuffer = await generatePdf(ledger, transactions);

    // Set response headers and send PDF buffer
    res.setHeader("Content-Disposition", `attachment; filename="Ledger_Report_${ledger.name}.pdf"`);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
