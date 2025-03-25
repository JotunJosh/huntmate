import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dataPath, setDataPath] = useState("");
  const [skillDetails, setSkillDetails] = useState([]);
  const [savedSkills, setSavedSkills] = useState([]);
  const [displayFormat] = useState(
    localStorage.getItem("displayFormat") || "{name} ({altName}) - {description}"
  );

  // 📌 1️⃣ Datenpfad von Electron holen
  useEffect(() => {
    async function fetchData() {
      if (!window.electronAPI) {
        console.error("❌ Fehler: `window.electronAPI` ist nicht verfügbar!");
        return;
      }

      const fetchedDataPath = await window.electronAPI.getDataPath();
      console.log("📂 Lade Daten von:", fetchedDataPath);
      setDataPath(fetchedDataPath);
    }

    fetchData();
  }, []);

  // 📌 2️⃣ JSON-Datei laden
  useEffect(() => {
    if (!dataPath) return;

    if (window.electronAPI.fileExists && window.electronAPI.fileExists(dataPath)) {
      window.electronAPI.readFile(dataPath)
        .then((raw) => {
          try {
            setSkills(JSON.parse(raw));
          } catch (error) {
            console.error("❌ Fehler beim Parsen der JSON-Datei:", error);
          }
        })
        .catch((error) => {
          console.error("❌ Fehler beim Laden der Datei:", error);
        });
    } else {
      console.error("❌ Fehler: data.json nicht gefunden:", dataPath);
    }
  }, [dataPath]);

useEffect(() => {
  async function loadSkillDetails() {
    const lang = i18n.language || "en";
    try {
      const path = await window.electronAPI.getSkillDetailsPath(lang);
      if (window.electronAPI.fileExists && (await window.electronAPI.fileExists(path))) {
        const raw = await window.electronAPI.readFile(path);
        const parsed = JSON.parse(raw);
        setSkillDetails(parsed);
      }
    } catch (err) {
      console.error("❌ Fehler beim Laden der Skill-Details:", err);
    }
  }

  loadSkillDetails();
}, [i18n.language]);

  // 📌 3️⃣ Beim Laden gespeicherte Skills abrufen
  useEffect(() => {
    const storedSkills = JSON.parse(localStorage.getItem("buildSkills")) || [];
    setSavedSkills(storedSkills);
  }, []);

  // 📌 4️⃣ Suchfilter
  const filteredSkills = skills.filter((skill) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const nameMatch = skill.name[i18n.language]?.toLowerCase().includes(searchLower);
    const altNameMatch = skill.name.en.toLowerCase().includes(searchLower);
    const descriptionMatch = skill.description[i18n.language]?.toLowerCase().includes(searchLower);

    return nameMatch || altNameMatch || descriptionMatch;
  });

  // 📌 5️⃣ Toggle für gespeicherte Skills
  const toggleSkillInBuild = (skill) => {
    let updatedSkills = JSON.parse(localStorage.getItem("buildSkills")) || [];

    if (updatedSkills.some((s) => s.id === skill.id)) {
      // ❌ Entferne den Skill, falls er schon existiert
      updatedSkills = updatedSkills.filter((s) => s.id !== skill.id);
    } else {
      // ✅ Füge den Skill hinzu, falls er nicht existiert
      updatedSkills.push(skill);
    }

    localStorage.setItem("buildSkills", JSON.stringify(updatedSkills));
    setSavedSkills(updatedSkills); // ⬅️ State aktualisieren, damit die UI sich anpasst
  };

  const getSkillTooltip = (skillNameEn) => {
    if (!skillNameEn || !skillDetails) return null;
  
    const normalized = skillNameEn.trim().toLowerCase();
    const match = skillDetails.find((s) => s.name.trim().toLowerCase() === normalized);
  
    if (!match || !match.levels?.length) return null;
  
    return match.levels
      .map((lvl) => `🔹 ${lvl.level}: ${lvl.effect} ${lvl.value ? `(${lvl.value})` : ""}`)
      .join("\n");
  };

  // 📌 6️⃣ Formatierte Anzeige der Suchergebnisse
  const formatSkill = (skill) => {
    return displayFormat
      .replace("{name}", `<strong>${skill.name[i18n.language]}</strong>`)
      .replace("{altName}", `${skill.name.en}`)
      .replace("{description}", skill.description[i18n.language]);
  };

  return (
    <div>
      <h1>{t("searchTitle")}</h1>

      {/* 🔹 Suchleiste */}
      <input
        type="text"
        placeholder={t("searchPlaceholder")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

{/* 🔹 Suchergebnisse */}
<ul>
  {filteredSkills.map((skill) => {
    const isSaved = savedSkills.some((s) => s.id === skill.id);
    const skillName = skill.name[i18n.language] || skill.name.en;
    const tooltip = getSkillTooltip(skillName);

    return (
      <li key={skill.id} className="skill-item">
        <span className="tooltip-wrapper">
        <span className="tooltip-icon">ℹ️</span>
          <span
            className="skill-text"
            dangerouslySetInnerHTML={{ __html: formatSkill(skill) }}
          />
          <div className="tooltip-content">
            {getSkillTooltip(skill.name[i18n.language]) || t("noDetails")}
          </div>
        </span>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => toggleSkillInBuild(skill)}
            className={`add-button ${isSaved ? "saved" : ""}`}
            title={isSaved ? t("removeFromBuild") : t("addToBuild")}
          >
            {isSaved ? "✔" : "+"}
          </button>

          <button
            onClick={() => navigate("/deco", { state: { query: skillName } })}
            className="search-button"
            title={t("searchDecosWithSkill")}
          >
            🔍
          </button>
        </div>
      </li>
    );
  })}
</ul>
    </div>
  );
};

export default SearchPage;
