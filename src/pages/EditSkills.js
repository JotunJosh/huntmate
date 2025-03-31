// ⚛️ React, i18n & Router
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// 🧠 Seite zum Bearbeiten der Basis-Skills (Name + Beschreibung)
// Page for editing base skills (name + description)
const EditSkills = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // 📦 States
  const [skills, setSkills] = useState([]);         // Skill-Liste
  const [searchTerm, setSearchTerm] = useState(""); // Filtertext
  const [dataPath, setDataPath] = useState(null);   // Pfad zur data.json

  // 📁 Hole Pfad zur Datei data.json (zentrale Skill-Daten)
  useEffect(() => {
    if (window.electronAPI?.getDataPath) {
      window.electronAPI.getDataPath().then(setDataPath);
    } else {
      console.error("❌ Fehler: `getDataPath` nicht verfügbar!");
    }
  }, []);

  // 📄 Datei lesen und Skills laden
  useEffect(() => {
    if (!dataPath) return;

    window.electronAPI.readFile(dataPath)
      .then((raw) => {
        try {
          setSkills(JSON.parse(raw));
        } catch (e) {
          console.error("❌ Fehler beim Parsen:", e);
        }
      })
      .catch((err) => console.error("❌ Fehler beim Laden:", err));
  }, [dataPath]);

  // 🔍 Filtere nach dem eingegebenen Suchbegriff
  const filtered = skills.filter((skill) =>
    skill.name[i18n.language]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✏️ Skill bearbeiten (Name oder Beschreibung)
  const handleEdit = (index, key, value) => {
    const updated = [...skills];
    updated[index][key][i18n.language] = value;
    setSkills(updated);
  };

  // 💾 Speichern der Änderungen in die Datei
  const saveChanges = () => {
    if (!dataPath) return;
    window.electronAPI.writeFile(dataPath, JSON.stringify(skills, null, 2))
      .then(() => alert("✅ Gespeichert!"))
      .catch((err) => console.error("Fehler beim Schreiben:", err));
  };

  return (
    <div className="settings-container">
      <h1 style={{ textAlign: "center" }}>
        {t("editSkillTitle") || "Skills bearbeiten"}
      </h1>

      {/* 🔍 Suchfeld */}
      <input
        type="text"
        className="search-input"
        placeholder="🔍 Skill suchen..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* 📜 Liste aller bearbeitbaren Skills */}
      <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
        {filtered.map((skill, index) => (
          <div key={skill.id} className="skill-item">
            <div className="skill-text">
              <strong>{skill.name[i18n.language]}</strong>
              <br />

              {/* 🧠 Name bearbeiten */}
              <input
                type="text"
                value={skill.name[i18n.language]}
                onChange={(e) => handleEdit(index, "name", e.target.value)}
                placeholder="Name"
              />

              {/* 💬 Beschreibung bearbeiten */}
              <input
                type="text"
                value={skill.description[i18n.language]}
                onChange={(e) => handleEdit(index, "description", e.target.value)}
                placeholder="Beschreibung"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 🔘 Buttons: Speichern & Zurück */}
      <div className="button-container">
        <button onClick={saveChanges}>{t("save")}</button>
        <button onClick={() => navigate("/edit")}>{t("back")}</button>
      </div>
    </div>
  );
};

export default EditSkills;
