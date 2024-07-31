import React, { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Field, Label, Select } from "@headlessui/react";
import { toast, Toaster } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useAuth } from "../context/AuthContext";
import clsx from "clsx";
import axios from "axios";

const AddTransationModal = ({ isOpen, onClose, ledgerName }) => {
  const { selectedLedger } = useAuth();
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("given");
  const apiUrl = "https://ledger-transactions-management-1.onrender.com";
  const auth = JSON.parse(localStorage.getItem("auth"));

  const handleAddTransaction = async () => {
    if (!amount) return toast.error("Enter amount");

    try {
      const response = await axios.post(
        `${apiUrl}/transaction`,
        {
          ledgerId: selectedLedger,
          amount: parseFloat(amount),
          date: new Date().toISOString(),
          type: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      toast.success("Transaction added successfully");
      console.log(response.data);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add transaction");
    }
  };

  return (
    <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={onClose}>
      <Toaster />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <Toaster />
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            style={{ backgroundColor: "#b0d4ff" }}
            className="w-[900px] max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out border-2 border-black"
          >
            <DialogTitle as="h3" className="text-2xl font-semibold flex justify-between items-center">
              Add a transaction
              <div onClick={onClose} className="hover:cursor-pointer border-2 rounded-md">
                <RxCross2 />
              </div>
            </DialogTitle>

            <div className="mt-2">
              <label className="text-md font-medium mt-3">Ledger</label>
              <input
                className="mt-3 block w-full rounded-lg border-none  py-1.5 px-3 text-sm/6 bg-black"
                placeholder="Enter ledger name"
                value={ledgerName}
                disabled
              />
            </div>

            <div>
              <label className="text-md font-medium">Amount</label>
              <input
                className="mt-3 block w-full rounded-lg border-none bg-black py-1.5 px-3 text-sm/6"
                placeholder="Enter Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <Field>
              <Label className="text-sm/6 font-medium">Given or taken?</Label>

              <div className="relative">
                <Select
                  className={clsx(
                    "mt-3 block w-full appearance-none rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-sm/6",
                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                    "*:text-black"
                  )}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="given">Given</option>
                  <option value="taken">Taken</option>
                </Select>
              </div>
            </Field>

            <div className="mt-4 flex justify-center">
              <button
                onClick={handleAddTransaction}
                className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none"
              >
                Add
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default AddTransationModal;
