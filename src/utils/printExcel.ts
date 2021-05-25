import XLSX from 'xlsx';

const printExcel = (data: any, filename: string) => {
  const sheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, filename);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export default printExcel;
