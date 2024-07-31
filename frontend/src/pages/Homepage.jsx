import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaPlus } from "react-icons/fa";
import clsx from "clsx";
import { FaHistory } from "react-icons/fa";
import AddLedgerModal from "../../components/AddLedgerModal";
import {
  Button,
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Field,
  Input,
  Label,
} from "@headlessui/react";
import AddTransationModal from "../../components/AddTransationModal";
import TransactionHistoryModal from "../../components/TransactionHistoryModal";
import axios from "axios";

const Homepage = () => {
  const { auth, ledgers, selectLedger, selectedLedger, transactions } = useAuth();
  console.log(selectedLedger);
  let [isOpen, setIsOpen] = useState(false);
  let [addTrasactionIsOpen, setAddTrasactionIsOpen] = useState(false);
  let [trasactionHistoryIsOpen, setTrasactionHistoryIsOpen] = useState(false);
  const [selectedledgerName, setSelectedledgerName] = useState("");
  const [allTransactions, setAllTransactions] = useState([]);

  console.log("ALL", allTransactions);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  function openTrasactionModal(ledgerId, ledgerName) {
    selectLedger(ledgerId);
    setSelectedledgerName(ledgerName);
    setAddTrasactionIsOpen(true);
  }

  function closeTrasactionModal() {
    setAddTrasactionIsOpen(false);
  }

  function openTrasactionHistoyModal(ledgerId) {
    selectLedger(ledgerId);
    fetchTransactions(ledgerId);
    setTrasactionHistoryIsOpen(true);
  }

  function closeTrasactionHistoyModal() {
    setTrasactionHistoryIsOpen(false);
  }

  const fetchTransactions = async (ledgerId) => {
    const link = `http://localhost:9000/transaction/${ledgerId}`;
    console.log("LINK", link, auth.token, selectedLedger);
    try {
      const response = await axios.get(link, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setAllTransactions(response.data);
      console.log("RESPONSE", response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <>
        <AddLedgerModal isOpen={isOpen} onClose={close} />
        <AddTransationModal
          isOpen={addTrasactionIsOpen}
          onClose={closeTrasactionModal}
          ledgerName={selectedledgerName}
        />
        <TransactionHistoryModal
          isOpen={trasactionHistoryIsOpen}
          onClose={closeTrasactionHistoyModal}
          transactions={allTransactions}
        />
      </>
      <div className="flex justify-between py-5  bg-yellow-400/60 px-16 text-2xl font-semibold text-slate-800">
        <div>LEDGER</div>
        <div className="flex items-center gap-2 hover:cursor-pointer" onClick={open}>
          <span>
            <FaPlus size={20} />
          </span>
          ADD A LEDGER
        </div>
      </div>

      <div
        className={`${
          (isOpen || addTrasactionIsOpen || trasactionHistoryIsOpen) && "blur backdrop-blur-sm"
        } px-16 flex flex-col gap-3 mt-4`}
      >
        {ledgers.map((ledger) => (
          <div
            key={ledger._id}
            className="border-2 border-black/40 rounded-md p-9 flex items-center justify-between bg-slate-100"
          >
            <p className="text-2xl font-semibold text-slate-800">
              <span className="text-xl">Ledger: </span>
              {ledger.name}
            </p>
            <div className="flex gap-2 text-white text-sm">
              <div
                className="flex items-center gap-2 border p-1 bg-blue-400 px-4 hover:cursor-pointer rounded-md"
                onClick={() => openTrasactionModal(ledger._id, ledger.name)}
              >
                Add a transaction <FaPlus />
              </div>
              <div
                className="flex items-center gap-2 border p-1 bg-green-400 px-4 hover:cursor-pointer rounded-md"
                onClick={() => openTrasactionHistoyModal(ledger._id)}
              >
                View all transaction <FaHistory />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
