import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./EditSkillDetails.css";

const EditSkillDetails = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [details, setDetails] = useState([]);
  const [dataPath, setDataPath] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 📁 Hole Pfad zur Sprachdatei z. B. skills_de.json
  useEffect(() => {
    if (window.electronAPI?.getSkillDetailsPath) {
      window.electronAPI.getSkillDetailsPath(i18n.language).then(setDataPath);
    }
  }, [i18n.language]);

  // 📄 Lade die Datei
  useEffect(() => {
    if (!dataPath) return;
    window.electronAPI.readFile(dataPath).then((raw) => {
      try {
        const parsed = JSON.parse(raw);
        setDetails(parsed);
      } catch (e) {
        console.error("Fehler beim Parsen:", e);
      }
    });
  }, [dataPath]);

  // 🔍 Filter
  const filtered = details.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📝 Bearbeiten
  const handleEdit = (index, levelIndex, newText) => {
    const updated = [...details];
    updated[index].levels[levelIndex].effect = newText;
    setDetails(updated);
  };

  // 💾 Speichern
  const saveChanges = () => {
    if (!dataPath) return;
    window.electronAPI.writeFile(dataPath, JSON.stringify(details, null, 2));
    alert("Gespeichert!");
  };

  return (
    <div className="edit-container">
      <h1>🔧 Erweiterte Skill-Details bearbeiten</h1>

      <input
        type="text"
        className="edit-input"
        placeholder="Skill suchen..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button className="edit-save-button" onClick={saveChanges}>
        💾 {t("save")}
      </button>

      <ul className="edit-list">
        {filtered.map((skill, index) => (
          <li key={skill.name} className="edit-skill-box">
            <div className="edit-skill-header">
              <span className="edit-skill-title">{skill.name}</span>
              <span className="edit-skill-description">{skill.description}</span>
            </div>

            {skill.levels.map((lvl, levelIndex) => (
              <div key={levelIndex} className="edit-level-row">
                <label className="edit-level-label">{lvl.level}</label>
                <input
                  type="text"
                  className="edit-level-input"
                  value={lvl.effect}
                  onChange={(e) =>
                    handleEdit(index, levelIndex, e.target.value)
                  }
                />
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditSkillDetails;
