import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const EditDecos = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [decos, setDecos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dataPath, setDataPath] = useState(null);

  useEffect(() => {
    if (window.electronAPI?.getDecoDataPath) {
      window.electronAPI.getDecoDataPath().then(setDataPath);
    } else {
      console.error("❌ Fehler: `getDecoDataPath` nicht verfügbar!");
    }
  }, []);

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

  const filtered = decos.filter((deco) =>
    deco.name[i18n.language]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (index, key, value) => {
    const updated = [...decos];
    updated[index][key][i18n.language] = value;
    setDecos(updated);
  };

  const saveChanges = () => {
    if (!dataPath) return;
    window.electronAPI.writeFile(dataPath, JSON.stringify(decos, null, 2))
      .then(() => alert("✅ Gespeichert!"))
      .catch((err) => console.error("Fehler beim Schreiben:", err));
  };

  return (
    <div className="settings-container">
      <h1 style={{ textAlign: "center" }}>{t("editDecoTitle") || "Dekorationen bearbeiten"}</h1>

      <input
        type="text"
        className="search-input"
        placeholder="🔍 Dekoration suchen..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
        {filtered.map((deco, index) => (
          <div key={deco.id} className="skill-item">
            <div className="skill-text">
              <strong>{deco.name[i18n.language]}</strong>
              <br />
              <input
                type="text"
                value={deco.name[i18n.language]}
                onChange={(e) => handleEdit(index, "name", e.target.value)}
                placeholder="Name"
              />
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

      <div className="button-container">
        <button onClick={saveChanges}>{t("save")}</button>
      </div>
    </div>
  );
};

export default EditDecos;
