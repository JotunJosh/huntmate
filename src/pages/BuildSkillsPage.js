// ⚛️ React Basics & Routing & i18n
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";

// 💬 Tooltip-Komponente für Skill-Details
// Tooltip component used to show skill level info on hover
const Tooltip = ({ children, position }) => {
  if (!position) return null;

  const style = {
    position: "fixed",
    top: position.top + 8,
    left: position.left,
    zIndex: 99999,
    background: "rgba(30,30,30,0.95)",
    padding: "8px 12px",
    color: "#f5f2eb",
    borderRadius: "6px",
    fontSize: "13px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    maxWidth: "300px",
    whiteSpace: "pre-line",
    pointerEvents: "none"
  };

  return ReactDOM.createPortal(
    <div style={style}>{children}</div>,
    document.body
  );
};

// 🔧 Hauptkomponente: Zeigt gespeicherte Skills & Details
// Main component: Displays saved skills with formatting and actions
const BuildSkillsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // 💾 States
  const [skillDetails, setSkillDetails] = useState([]); // Detaildaten für Tooltips
  const [buildSkills, setBuildSkills] = useState([]);   // Gespeicherte Skills
  const [tooltipContent, setTooltipContent] = useState(""); // Text im Tooltip
  const [tooltipPosition, setTooltipPosition] = useState(null); // Tooltip-Position
  const displayFormat = localStorage.getItem("displayFormat") || "{name} ({altName}) - {description}";

  // 📦 Lade gespeicherte Skills aus localStorage
  useEffect(() => {
    const storedSkills = JSON.parse(localStorage.getItem("buildSkills")) || [];
    setBuildSkills(storedSkills);
  }, []);

  // ❌ Entfernt Skill aus Build + Speicher
  const removeSkill = (skillId) => {
    const updatedSkills = buildSkills.filter(skill => skill.id !== skillId);
    setBuildSkills(updatedSkills);
    localStorage.setItem("buildSkills", JSON.stringify(updatedSkills));
  };

  // 📄 Lädt Skill-Details (z. B. Level & Effekte)
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

  // 💬 Tooltip-Text für Skill anhand Name suchen
  const getSkillTooltip = (skillNameEn) => {
    if (!skillNameEn || !skillDetails) return null;

    const normalized = skillNameEn.trim().toLowerCase();
    const match = skillDetails.find((s) => s.name.trim().toLowerCase() === normalized);

    if (!match || !match.levels?.length) return null;

    return match.levels
      .map((lvl) => `🔹 ${lvl.level}: ${lvl.effect} ${lvl.value ? `(${lvl.value})` : ""}`)
      .join("\n");
  };

  // 🎨 Anzeigeformat der Skill-Info zusammenbauen
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
        {/* 🔍 Zeige Hinweis, wenn keine Skills gespeichert */}
        {buildSkills.length === 0 ? (
          <p>{t("noSkillsSaved")}</p>
        ) : (
          buildSkills.map((skill) => {
            return (
              <li key={skill.id} className="skill-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {/* 🧠 Skill-Info anzeigen (HTML-Formatiert) */}
                  <span
                    className="skill-text"
                    dangerouslySetInnerHTML={{ __html: formatSkill(skill) }}
                  />
                </div>

                {/* 🔘 Tooltip + Buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    className="tooltip-icon"
                    style={{ fontSize: "18px" }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltipContent(getSkillTooltip(skill.name[i18n.language]) || t("noDetails"));
                      setTooltipPosition({ top: rect.bottom, left: rect.left });
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                      setTooltipPosition(null);
                    }}
                  >
                    ℹ️
                  </span>

                  {/* 🔍 Suche Dekorationen zu Skill */}
                  <button
                    onClick={() => navigate("/deco", { state: { query: skill.name[i18n.language] } })}
                    className="search-button"
                  >
                    🔍
                  </button>

                  {/* ❌ Skill entfernen */}
                  <button onClick={() => removeSkill(skill.id)} className="remove-button">X</button>
                </div>
              </li>
            );
          })
        )}
      </ul>

      {/* 💬 Tooltip-Overlay */}
      <Tooltip position={tooltipPosition}>{tooltipContent}</Tooltip>
    </div>
  );
};

export default BuildSkillsPage;
