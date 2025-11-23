// server/services/exportService.js
// Provides helpers to create Excel and PDF exports from an array of expense objects.
// Uses exceljs and pdfkit (install them: `npm i exceljs pdfkit`)

const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const stream = require('stream');

/**
 * buildExcelBuffer
 * @param {Array<Object>} rows - array of expense objects { date, amount, category, description }
 * @returns {Promise<Buffer>}
 */
async function buildExcelBuffer(rows = []) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Expenses');

    sheet.columns = [
        { header: 'Date', key: 'date', width: 20 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Category', key: 'category', width: 20 },
        { header: 'Description', key: 'description', width: 40 },
    ];

    rows.forEach((r) => {
        sheet.addRow({
            date: new Date(r.date).toLocaleString(),
            amount: r.amount,
            category: r.category,
            description: r.description || ''
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

/**
 * buildPdfBuffer
 * @param {Array<Object>} rows
 * @returns {Promise<Buffer>}
 *
 * Simple PDF generator: one line per expense. For more complex PDFs use templates.
 */
function buildPdfBuffer(rows = []) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 40 });
        const passthrough = new stream.PassThrough();
        const buffers = [];

        doc.pipe(passthrough);
        passthrough.on('data', (chunk) => buffers.push(chunk));
        passthrough.on('end', () => resolve(Buffer.concat(buffers)));
        passthrough.on('error', (err) => reject(err));

        doc.fontSize(18).text('Wealthwise - Expense Report', { align: 'center' });
        doc.moveDown(1);

        doc.fontSize(12);
        rows.forEach((r) => {
            doc.text(
                `${new Date(r.date).toLocaleDateString()} — ${r.category} — ₹${r.amount} — ${r.description || ''}`
            );
        });

        doc.end();
    });
}

module.exports = {
    buildExcelBuffer,
    buildPdfBuffer
};