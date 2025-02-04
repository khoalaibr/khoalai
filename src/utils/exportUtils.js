// Ubicación: src/utils/exportUtils.js
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (data, filenamePrefix = 'export') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, `${filenamePrefix}_${new Date().toISOString()}.xlsx`);
};

export const exportToPDF = (data, filenamePrefix = 'export') => {
  const doc = new jsPDF();
  const tableColumn = ['Symbol', 'Strategy', 'Action'];
  const tableRows = data.map(item => [item.symbol, item.strategy, item.action]);

  doc.text('Report', 14, 20);
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 30,
  });
  doc.save(`${filenamePrefix}_${new Date().toISOString()}.pdf`);
};
