import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useAuth } from "../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import CSS for DatePicker
import { FaDownload } from "react-icons/fa6";
import axios from "axios";

const TransactionHistoryModal = ({ isOpen, onClose, transactions }) => {
  const { selectedLedger } = useAuth();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const auth = JSON.parse(localStorage.getItem("auth"));

  console.log(startDate.toISOString(), endDate.toISOString());

  const formatDateForBackend = (date) => {
    if (!date) return null;
    return date.toISOString();
  };

  const handleFetchData = async () => {
    const formattedStartDate = formatDateForBackend(startDate);
    const formattedEndDate = formatDateForBackend(endDate);

    try {
      const response = await axios.get(`http://localhost:9000/transaction/${selectedLedger}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
      });
      console.log("HERE", response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.post(
        "http://localhost:9000/transaction/pdf",
        {
          ledgerId: selectedLedger,
          startDate: formatDateForBackend(startDate),
          endDate: formatDateForBackend(endDate),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error downloading transactions:", error);
    }
  };

  return (
    <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={onClose}>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            style={{ backgroundColor: "#7beaa6" }}
            className="w-full max-w-lg rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out border-2 border-black"
          >
            <DialogTitle as="h3" className="text-2xl font-semibold flex justify-between items-center">
              Transaction history
              <div className="hover:cursor-pointer p-2 flex gap-3">
                <div className="" onClick={handleDownload}>
                  <FaDownload />
                </div>
                <div onClick={onClose} className="ml-[10px]  border-2 rounded-md">
                  <RxCross2 />
                </div>
              </div>
            </DialogTitle>

            {/* Date Pickers */}
            <div className="mt-4 flex">
              <div className="w-full flex items-center gap-3">
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <DatePicker
                  showIcon
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="border rounded-md p-2 w-full"
                />
                <label className="block text-sm font-medium mb-1">End Date</label>
                <DatePicker
                  showIcon
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className="border rounded-md p-2 w-full"
                />
              </div>
            </div>

            <table className="w-full mt-4 border-separate border-spacing-2 border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-center">
                  <th className="px-4 py-2 text-center">Date</th>
                  <th className="px-4 py-2 text-center">Amount</th>
                  <th className="px-4 py-2 text-center">Type</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="px-4 py-2 text-center">
                      {new Date(transaction.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2 text-center">{transaction.amount}</td>
                    <td className="px-4 py-2 text-center">{transaction.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex justify-center">
              <button
                onClick={handleFetchData}
                className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none"
              >
                Fetch
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default TransactionHistoryModal;
