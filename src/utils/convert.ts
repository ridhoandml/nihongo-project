import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"
import xlsx from "xlsx"

type SheetName = "Noun" | "Particles" | "Katakana Noun" | "Adverb" | "Adjective i" | "Adjective na" | "Kanji" | "Bunpou" | "Verb"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const excelPath = [
  {
    input: path.resolve(__dirname, "../data/excel/jlpt-n5.xlsx"),
    output: path.resolve(__dirname, "../data/json/jlpt-n5")
  },
  {
    input: path.resolve(__dirname, "../data/excel/jlpt-n4.xlsx"),
    output: path.resolve(__dirname, "../data/json/jlpt-n4")
  }
]

excelPath.forEach( excel => {
  if (!fs.existsSync(excel.output)) fs.mkdirSync(excel.output, { recursive: true })
  
  const workbook = xlsx.readFile(excel.input)
  
  workbook.SheetNames.forEach((sheetName) => {
    const name = sheetName as SheetName
    const sheet = workbook.Sheets[name]
    const jsonData = xlsx.utils.sheet_to_json<Record<string, any>>(sheet)

    const isN5 = excel.input.includes("n5")

    if (name === "Kanji") {
      const formattedData = jsonData.map((row) => ({
        main: row["Kanji"],
        onyomi: row["Onyomi"],
        kunyomi: row["Kunyomi"],
        meaning: row["Meaning"]
      }))
      return exportExcel(name, excel.output, formattedData)
    }
    if (name === "Particles" || name === "Katakana Noun" || name === "Bunpou") {
      const formattedData = jsonData.map((row) => ({
        main: row["Grammar"] || row["Word"],
        romaji: isN5 ? row["Romaji"] : undefined,
        meaning: row["Meaning"]
      }))
      return exportExcel(name, excel.output, formattedData)
    }
    if (name === "Verb") {
      const formattedData = jsonData.map((row) => ({
        main: row["Plain"],
        kana: row["Kana"],
        romaji: isN5 ? row["Romaji"] : undefined,
        meaning: row["Meaning"],
        polite: row["Polite"],
        te: row["Te"],
        volitional: row["Volitional"],
        conditional: row["Conditional"],
        potential: row["Potential"],
        passive: row["Passive"],
      }))
      return exportExcel(name, excel.output, formattedData)
    } else {
      const formattedData = jsonData.map((row) => ({
        main: row["Word"],
        kana: row["Kana"],
        romaji: isN5 ? row["Romaji"] : undefined,
        meaning: row["Meaning"]
      }))
      return exportExcel(name, excel.output, formattedData)
    }
  })
})

function exportExcel (sheetName: SheetName, output: string, formattedData: any) {
  const outputFilePath = path.join(output, `${sheetName.replace(/\s+/g, "-").toLowerCase()}.json`)
  fs.writeFileSync(outputFilePath, JSON.stringify(formattedData, null, 2), "utf-8")
  return console.log(`✅ Exported ${outputFilePath}`)
}