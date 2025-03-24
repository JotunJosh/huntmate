const xlsx = require("xlsx");
const fs = require("fs");

// 📌 Pfad zur Excel-Datei
const excelFilePath = "MHW-Skills.xlsx";
const outputJsonPath = "data.json";

// 📌 Excel-Datei einlesen
const workbook = xlsx.readFile(excelFilePath);
const sheetName = workbook.SheetNames[0]; // Erstes Tabellenblatt
const sheet = workbook.Sheets[sheetName];

// 📌 Excel-Daten in JSON umwandeln
const rawData = xlsx.utils.sheet_to_json(sheet);

// 📌 Datenstruktur für die JSON-Datei anpassen
const jsonData = rawData.map((row, index) => ({
  id: index + 1, // Automatische ID
  name: {
    de: row["Skill_DEU"] || "Unbekannt",
    en: row["Skill_ENG"] || "Unknown",
    fr: row["Skill_FRZ"] || "Inconnu"
  },
  description: {
    de: row["Beschreibung_DEU"] || "Keine Beschreibung vorhanden",
    en: row["Beschreibung_ENG"] || "No description available",
    fr: row["Beschreibung_FRZ"] || "Aucune description disponible"
  }
}));

// 📌 JSON-Datei speichern
fs.writeFileSync(outputJsonPath, JSON.stringify(jsonData, null, 2), "utf8");

console.log(`✅ Die Datei ${outputJsonPath} wurde erfolgreich erstellt!`);
