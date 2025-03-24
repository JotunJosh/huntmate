import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const BuildSkillsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
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
        <span className="skill-text" dangerouslySetInnerHTML={{ __html: formatSkill(skill) }} />
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
