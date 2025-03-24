const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

// 📌 Dateien einlesen
const skillFile = path.join(__dirname, "MHW-Skills.xlsx");
const decoFile = path.join(__dirname, "MHW-Deko.xlsx");

// 📌 Workbooks laden
const skillWorkbook = xlsx.readFile(skillFile);
const decoWorkbook = xlsx.readFile(decoFile);

// 📌 Erste Sheets lesen
const skillSheet = skillWorkbook.Sheets[skillWorkbook.SheetNames[0]];
const decoSheet = decoWorkbook.Sheets[decoWorkbook.SheetNames[0]];

// 📌 In JSON umwandeln
const skillsRaw = xlsx.utils.sheet_to_json(skillSheet);
const decosRaw = xlsx.utils.sheet_to_json(decoSheet);

// 📌 Deko-Zuordnung vorbereiten
const skillToDecosMap = {};
decosRaw.forEach((deco) => {
  const skill1 = deco.Skill_1_EN?.trim();
  const skill2 = deco.Skill_2_EN?.trim();

  if (skill1) {
    if (!skillToDecosMap[skill1]) skillToDecosMap[skill1] = [];
    skillToDecosMap[skill1].push(deco.Decoration);
  }

  if (skill2) {
    if (!skillToDecosMap[skill2]) skillToDecosMap[skill2] = [];
    skillToDecosMap[skill2].push(deco.Decoration);
  }
});

// 📌 Skills mit Dekorationen anreichern
const finalSkills = skillsRaw.map((skill, index) => ({
  id: index + 1,
  name: {
    en: skill.Skill_EN,
    de: skill.Skill_DEU,
    fr: skill.Skill_FR,
  },
  description: {
    en: skill.Description_EN,
    de: skill.Description_DEU,
    fr: skill.Description_FR,
  },
  decorations: skillToDecosMap[skill.Skill_EN?.trim()] || [],
}));

// 📌 Als JSON speichern
const outputPath = path.join(__dirname, "data.json");
fs.writeFileSync(outputPath, JSON.stringify(finalSkills, null, 2), "utf8");

console.log(`✅ Fertig! ${finalSkills.length} Skills wurden verarbeitet.`);
console.log(`📄 Gespeichert unter: ${outputPath}`);
