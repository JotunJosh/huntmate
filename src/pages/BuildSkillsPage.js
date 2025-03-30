import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";

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

const BuildSkillsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [skillDetails, setSkillDetails] = useState([]);
  const [buildSkills, setBuildSkills] = useState([]);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState(null);
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
          buildSkills.map((skill) => {
            const skillName = skill.name[i18n.language] || skill.name.en;

            return (
              <li key={skill.id} className="skill-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    className="skill-text"
                    dangerouslySetInnerHTML={{ __html: formatSkill(skill) }}
                  />
                </div>
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
                  <button
                    onClick={() => navigate("/deco", { state: { query: skill.name[i18n.language] } })}
                    className="search-button"
                  >
                    🔍
                  </button>
                  <button onClick={() => removeSkill(skill.id)} className="remove-button">X</button>
                </div>
              </li>
            );
          })
        )}
      </ul>
      <Tooltip position={tooltipPosition}>{tooltipContent}</Tooltip>
    </div>
  );
};

export default BuildSkillsPage;
