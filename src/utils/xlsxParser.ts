import { Donation } from "types/donationType";
import * as XLSX from "xlsx";

const fillMergedCells = (worksheet: XLSX.WorkSheet) => {
  (worksheet["!merges"] || []).forEach((merge) => {
    const startCell =
      worksheet[XLSX.utils.encode_cell({ r: merge.s.r, c: merge.s.c })];
    if (!startCell) return;
    for (let row = merge.s.r; row <= merge.e.r; ++row) {
      for (let col = merge.s.c; col <= merge.e.c; ++col) {
        worksheet[XLSX.utils.encode_cell({ r: row, c: col })] = startCell;
      }
    }
  });
};

export const parseXlsx = async (file: File): Promise<Donation[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e: any) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        fillMergedCells(worksheet);
        const json = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          defval: null,
        });

        let donations = json.reduce((acc: Donation[], row: any) => {
          let donationType = row["종류"] || acc[acc.length - 1]?.donationType;
          let name = row["이름"];

          if (donationType === "종류" || name === "이름") return acc;

          if (name !== "무명" && name != null) {
            let donation = acc.find((d) => d.donationType === donationType);
            if (donation) {
              donation.data.push(name);
            } else {
              acc.push({ donationType, data: [name] });
            }
          }

          return acc;
        }, []);

        donations.forEach((donation) => {
          donation.data.sort((a, b) => a.localeCompare(b, "ko"));
        });

        resolve(donations);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsBinaryString(file);
  });
};
