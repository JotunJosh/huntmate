import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const BuildSkillsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [skillDetails, setSkillDetails] = useState([]);
  const [buildSkills, setBuildSkills] = useState([]);
  const displayFormat = localStorage.getItem("displayFormat") || "{name} ({altName}) - {description}";

  useEffect(() => {
    const storedSkills = JSON.parse(localStorage.getItem("buildSkills")) || [];
    setBuildSkills(storedSkills);
  }, []);

  const removeSkill = (skillId) => {
    const updatedSkills = buildSkills.filter(skill => skill.id !== skillId);
    setBuildSkills(updatedSkills);
    localStorage.setItem("buildSkills", JSON.stringify(updatedSkills));
  };

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

const getSkillTooltip = (skillNameEn) => {
  if (!skillNameEn || !skillDetails) return null;

  const normalized = skillNameEn.trim().toLowerCase();
  const match = skillDetails.find((s) => s.name.trim().toLowerCase() === normalized);

  if (!match || !match.levels?.length) return null;

  return match.levels
    .map((lvl) => `🔹 ${lvl.level}: ${lvl.effect} ${lvl.value ? `(${lvl.value})` : ""}`)
    .join("\n");
};

  // 🔹 Formatierte Anzeige der gespeicherten Skills
  const formatSkill = (skill) => {
    if (!skill || !skill.name || !skill.description) return "❌ Fehler: Skill-Daten unvollständig!";

    return displayFormat
      .replace("{name}", `<strong>${skill.name[i18n.language] || "???"}</strong>`)
      .replace("{altName}", `${skill.name.en || "???"}`)
      .replace("{description}", skill.description[i18n.language] || "Keine Beschreibung");
  };

  return (
    <div>
      <h1>{t("buildSkillsTitle")}</h1>
      
      <ul>
  {buildSkills.length === 0 ? (
    <p>{t("noSkillsSaved")}</p>
  ) : (
    buildSkills.map((skill) => (
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
        <button onClick={() => removeSkill(skill.id)} className="remove-button">X</button>

        {/* 🔍 Deko-Suche Button */}
        <button
              onClick={() => navigate("/deco", { state: { query: skill.name[i18n.language] } })}
              className="search-button"
            >
              🔍
            </button>

            
      </li>
    ))
  )}
</ul>

    </div>
  );
};

export default BuildSkillsPage;
