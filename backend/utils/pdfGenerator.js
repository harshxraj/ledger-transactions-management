import PDFDocument from "pdfkit";

/**
 * Generates a PDF report of transactions for a specific ledger.
 * @param {Object} ledger - The ledger object.
 * @param {Array} transactions - Array of transactions for the ledger.
 * @returns {Buffer} - A buffer containing the PDF data.
 */
export const generatePdf = (ledger, transactions) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    // Add content to the PDF
    doc.fontSize(20).text(`Ledger Report: ${ledger.name}`, { align: "center" });
    doc
      .fontSize(12)
      .moveDown()
      .text(
        `Date Range: ${transactions.length > 0 ? transactions[0].date.toISOString().split("T")[0] : ""} - ${
          transactions.length > 0
            ? transactions[transactions.length - 1].date.toISOString().split("T")[0]
            : ""
        }`
      );
    doc.moveDown();

    // Table headers
    doc
      .text("Date", { continued: true })
      .text("Type", { align: "center", continued: true })
      .text("Amount", { align: "right" });
    doc.moveDown();

    // Table content
    transactions.forEach((txn) => {
      doc
        .text(txn.date.toISOString().split("T")[0], { continued: true })
        .text(txn.type, { align: "center", continued: true })
        .text(txn.amount, { align: "right" });
      doc.moveDown();
    });

    // Footer
    doc.moveDown().text("End of Report", { align: "center" });

    doc.end();
  });
};
