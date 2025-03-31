// ⚛️ React, Router & i18n
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// 💎 Dekorationen-Suchseite
// Decoration Search Page
const DecoSearchPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // 📦 States für Daten & Suche
  const [decos, setDecorations] = useState([]); // Liste aller Dekorationen
  const [searchTerm, setSearchTerm] = useState(""); // Suchtext
  const [dataPath, setDataPath] = useState(""); // Pfad zur JSON-Datei

  // 📁 Pfad zur `data-decos.json` vom Main-Prozess holen
  // Request the full path to the decorations file from Electron
  useEffect(() => {
    async function fetchData() {
      if (!window.electronAPI?.getDecoDataPath) {
        console.error("❌ electronAPI.getDecoDataPath nicht verfügbar!");
        return;
      }

      const path = await window.electronAPI.getDecoDataPath();
      setDataPath(path);
    }

    fetchData();
  }, []);

  // 📖 Daten aus Datei laden und in State speichern
  // Read the decorations JSON and store it
  useEffect(() => {
    if (!dataPath) return;

    if (window.electronAPI.fileExists(dataPath)) {
      window.electronAPI
        .readFile(dataPath)
        .then((raw) => {
          try {
            setDecorations(JSON.parse(raw));
          } catch (e) {
            console.error("❌ Fehler beim Parsen:", e);
          }
        })
        .catch((err) => console.error("❌ Fehler beim Laden:", err));
    }
  }, [dataPath]);

  // 🔄 Falls man von einer anderen Seite mit einem "query"-Wert hier landet (z. B. über den 🔍-Button in BuildSkillsPage)
  // Receive and apply incoming search term from navigation (e.g. BuildSkillsPage)
  useEffect(() => {
    if (location.state?.query) {
      setSearchTerm(location.state.query);
    }
  }, [location.state]);

  // 🔍 Filtert alle Dekorationen nach Name oder Beschreibung
  // Filters decorations by name or description
  const filteredDecos = decos.filter((deco) => {
    if (!deco?.name || !deco?.description) return false;

    const query = searchTerm.toLowerCase();
    const nameMatch =
      deco.name[i18n.language]?.toLowerCase().includes(query) ||
      deco.name.en?.toLowerCase().includes(query);

    const descriptionMatch =
      deco.description[i18n.language]?.toLowerCase().includes(query) ||
      deco.description.en?.toLowerCase().includes(query);

    return nameMatch || descriptionMatch;
  });

  return (
    <div>
      <h1>{t("decoSearchTitle") || "Dekorationen suchen"}</h1>

      {/* 🔎 Suchfeld */}
      <input
        type="text"
        placeholder={t("searchPlaceholder")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* 📜 Ergebnisliste */}
      <ul>
        {filteredDecos.map((deco) => (
          <li key={deco.id} className="skill-item">
            <span className="skill-text">
              <strong>{deco.name[i18n.language] || deco.name.en}</strong>{" "}
              ({deco.name.en})
              <br />
              {deco.description[i18n.language] || deco.description.en}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DecoSearchPage;
