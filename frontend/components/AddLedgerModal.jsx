import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AddLedgerModal = ({ isOpen, onClose }) => {
  const [ledgerName, setLedgerName] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const auth = JSON.parse(localStorage.getItem("auth"));
  const { setLedgers, ledgers } = useAuth();

  const handleAddLedger = async () => {
    if (!ledgerName) {
      return toast.error("Add some ledger name");
    }

    try {
      const response = await axios.post(
        `${apiUrl}/ledger`,
        { name: ledgerName },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      toast.success("Ledger added successfully");
      console.log(response.data);
      const newLedger = response.data;
      setLedgers((prevLedgers) => [...prevLedgers, newLedger]);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add ledger");
    }
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative border z-10 focus:outline-none text-slate-100"
      onClose={onClose}
    >
      <Toaster />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            style={{ backgroundColor: "#fce073" }}
            className="w-full max-w-md rounded-xl bg-blue-900 p-6 backdrop-blur-2xl duration-300 ease-out border-2 border-black"
          >
            <DialogTitle
              as="h3"
              className="text-2xl font-semibold flex justify-between items-center text-slate-100"
            >
              Add a ledger
              <div onClick={onClose} className="hover:cursor-pointer border-2 rounded-md">
                <RxCross2 />
              </div>
            </DialogTitle>

            <div className="">
              <label className="text-md font-medium">Ledger name</label>
              <input
                className="mt-3 block w-full rounded-lg border-none bg-black py-1.5 px-3 text-sm/6"
                placeholder="Enter ledger name"
                value={ledgerName}
                onChange={(e) => setLedgerName(e.target.value)}
              />
            </div>

            <div className="mt-4 flex justify-center">
              <button
                className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none"
                onClick={handleAddLedger}
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

export default AddLedgerModal;
