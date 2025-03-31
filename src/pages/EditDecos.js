// ⚛️ React + i18n + Router
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// 🔧 Dekorationen bearbeiten
// Edit decorations (name & description)
const EditDecos = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // 📦 States
  const [decos, setDecos] = useState([]); // Liste aller Dekorationen
  const [searchTerm, setSearchTerm] = useState(""); // Suchbegriff
  const [dataPath, setDataPath] = useState(null); // Pfad zur JSON-Datei

  // 🔍 Pfad zur data-decos.json ermitteln
  useEffect(() => {
    if (window.electronAPI?.getDecoDataPath) {
      window.electronAPI.getDecoDataPath().then(setDataPath);
    } else {
      console.error("❌ Fehler: `getDecoDataPath` nicht verfügbar!");
    }
  }, []);

  // 📄 JSON-Datei einlesen
  useEffect(() => {
    if (!dataPath) return;

    window.electronAPI.readFile(dataPath)
      .then((raw) => {
        try {
          setDecos(JSON.parse(raw));
        } catch (e) {
          console.error("❌ Fehler beim Parsen:", e);
        }
      })
      .catch((err) => console.error("❌ Fehler beim Laden:", err));
  }, [dataPath]);

  // 🔍 Filtere nach Namen (sprachabhängig)
  const filtered = decos.filter((deco) =>
    deco.name[i18n.language]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✏️ Ändere Name oder Beschreibung
  const handleEdit = (index, key, value) => {
    const updated = [...decos];
    updated[index][key][i18n.language] = value;
    setDecos(updated);
  };

  // 💾 Änderungen speichern
  const saveChanges = () => {
    if (!dataPath) return;
    window.electronAPI.writeFile(dataPath, JSON.stringify(decos, null, 2))
      .then(() => alert("✅ Gespeichert!"))
      .catch((err) => console.error("Fehler beim Schreiben:", err));
  };

  return (
    <div className="settings-container">
      <h1 style={{ textAlign: "center" }}>
        {t("editDecoTitle") || "Dekorationen bearbeiten"}
      </h1>

      {/* 🔍 Suchfeld */}
      <input
        type="text"
        className="search-input"
        placeholder="🔍 Dekoration suchen..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* ✏️ Editierbare Liste */}
      <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
        {filtered.map((deco, index) => (
          <div key={deco.id} className="skill-item">
            <div className="skill-text">
              <strong>{deco.name[i18n.language]}</strong>
              <br />

              {/* 🔠 Name bearbeiten */}
              <input
                type="text"
                value={deco.name[i18n.language]}
                onChange={(e) => handleEdit(index, "name", e.target.value)}
                placeholder="Name"
              />

              {/* 💬 Beschreibung bearbeiten */}
              <input
                type="text"
                value={deco.description[i18n.language]}
                onChange={(e) => handleEdit(index, "description", e.target.value)}
                placeholder="Beschreibung"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 💾 Speichern / Zurück */}
      <div className="button-container">
        <button onClick={saveChanges}>{t("save")}</button>
        <button onClick={() => navigate("/edit")}>{t("back")}</button>
      </div>
    </div>
  );
};

export default EditDecos;
