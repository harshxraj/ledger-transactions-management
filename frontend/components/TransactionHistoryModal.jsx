import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useAuth } from "../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import CSS for DatePicker
import { FaDownload } from "react-icons/fa6";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

  const handleDownload = async () => {
    try {
      const response = await axios.post(
        "https://ledger-transactions-management-1.onrender.com/transaction/pdf",
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

  const generatePdf = async (ledgerId, startDate, endDate) => {
    const doc = new jsPDF();

    // Format the date range
    const formattedStartDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(startDate));

    const formattedEndDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(endDate));

    doc.text(`Ledger Report`, 10, 10);
    doc.text(`Date Range: ${formattedStartDate} - ${formattedEndDate}`, 10, 20);

    // Parse startDate and endDate to ensure accurate comparison
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the entire end day

    // Filter transactions based on the selected date range
    const filteredTransactions = transactions.filter((txn) => {
      const txnDate = new Date(txn.date);
      return txnDate >= start && txnDate <= end;
    });

    // Prepare table rows
    const tableColumn = ["Date", "Amount", "Type"];
    const tableRows = filteredTransactions.map((txn) => {
      const date = new Date(txn.date);
      // Format the date as "Month Day, Year"
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
      return [formattedDate, txn.amount, txn.type];
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save(`Ledger_Report.pdf`);
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
                <div
                  className=""
                  onClick={() =>
                    generatePdf(
                      selectedLedger,
                      formatDateForBackend(startDate),
                      formatDateForBackend(endDate)
                    )
                  }
                >
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
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default TransactionHistoryModal;
