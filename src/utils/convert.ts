import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import xlsx from "xlsx";

// ESM __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Input Excel path
const excelPath = [
  {
    input: path.resolve(__dirname, "../data/excel/jlpt-n5.xlsx"),
    ouput: path.resolve(__dirname, "../data/json/jlpt-n5")
  },
  {
    input: path.resolve(__dirname, "../data/excel/jlpt-n4.xlsx"),
    ouput: path.resolve(__dirname, "../data/json/jlpt-n4")
  }
]

excelPath.forEach( excel => {
  // Make sure output folder exists
  if (!fs.existsSync(excel.ouput)) {
    fs.mkdirSync(excel.ouput, { recursive: true });
  }
  
  // Load the workbook
  const workbook = xlsx.readFile(excel.input);
  
  // Loop over each sheet except "All"
  workbook.SheetNames.forEach((sheetName) => {
    if (sheetName === "All") return;
  
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json<Record<string, any>>(sheet);
  
    const formattedData = jsonData.map((row) => {
      let kanji = row["日本語"]
      let furigana = row["かな"] || ""
      if (sheetName === "Verb") {
        kanji = row["動詞"]
        furigana = row["Verb"]
      }
      if (sheetName === "Kanji") {
        kanji = row["Kanji"]
        furigana = "On: " + row["Onyomi"] + ";\n Kun: " + row["Kunyomi"] + ";"
      }
      if (sheetName === "Bunpou") kanji = row["ぶんぽう"]
      return {
        kanji,
        furigana,
        translation: row["Meaning"],
        check: false,
      }
    });
  
    const outputFilePath = path.join(excel.ouput, `${sheetName.replace(/\s+/g, "-").toLowerCase()}.json`);
  
    fs.writeFileSync(
      outputFilePath,
      JSON.stringify(formattedData, null, 2),
      "utf-8"
    );
  
    console.log(`✅ Exported ${outputFilePath}`);
  });
})
