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
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState(null);

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

  useEffect(() => {
    const storedSkills = JSON.parse(localStorage.getItem("buildSkills")) || [];
    setSavedSkills(storedSkills);
  }, []);

  const filteredSkills = skills.filter((skill) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const nameMatch = skill.name[i18n.language]?.toLowerCase().includes(searchLower);
    const altNameMatch = skill.name.en.toLowerCase().includes(searchLower);
    const descriptionMatch = skill.description[i18n.language]?.toLowerCase().includes(searchLower);

    return nameMatch || altNameMatch || descriptionMatch;
  });

  const toggleSkillInBuild = (skill) => {
    let updatedSkills = JSON.parse(localStorage.getItem("buildSkills")) || [];

    if (updatedSkills.some((s) => s.id === skill.id)) {
      updatedSkills = updatedSkills.filter((s) => s.id !== skill.id);
    } else {
      updatedSkills.push(skill);
    }

    localStorage.setItem("buildSkills", JSON.stringify(updatedSkills));
    setSavedSkills(updatedSkills);
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

  const formatSkill = (skill) => {
    return displayFormat
      .replace("{name}", `<strong>${skill.name[i18n.language]}</strong>`)
      .replace("{altName}", `${skill.name.en}`)
      .replace("{description}", skill.description[i18n.language]);
  };

  return (
    <div>
      <h1>{t("searchTitle")}</h1>
      <input
        type="text"
        placeholder={t("searchPlaceholder")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredSkills.map((skill) => {
          const isSaved = savedSkills.some((s) => s.id === skill.id);
          const skillName = skill.name[i18n.language] || skill.name.en;

          return (
            <li key={skill.id} className="skill-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {/* Linke Seite: + Button & Text */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  onClick={() => toggleSkillInBuild(skill)}
                  className={`add-button ${isSaved ? "saved" : ""}`}
                  title={isSaved ? t("removeFromBuild") : t("addToBuild")}
                >
                  {isSaved ? "✔" : "+"}
                </button>
                <span
                  className="skill-text"
                  dangerouslySetInnerHTML={{ __html: formatSkill(skill) }}
                />
              </div>

              {/* Rechte Seite: Lupe & Info */}
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
      <Tooltip position={tooltipPosition}>{tooltipContent}</Tooltip>
    </div>
  );
};

export default SearchPage;
