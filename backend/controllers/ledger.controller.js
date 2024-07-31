import Ledger from "../models/ledger.model.js";
import User from "../models/user.model.js";

export const createLedger = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId;

    const ledger = new Ledger({ name, user: userId });
    await ledger.save();

    // Add the ledger to the user's ledgers list
    await User.findByIdAndUpdate(userId, { $push: { ledgers: ledger._id } });

    res.status(201).json(ledger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserAllLedgers = async (req, res) => {
  try {
    const ledgers = await Ledger.find({ user: req.userId });
    res.status(200).json(ledgers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
