import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const DecoSearchPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [decos, setDecorations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dataPath, setDataPath] = useState("");
  const location = useLocation();

  // 📦 Pfad zur data-decos.json von Electron holen
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

  // 📄 Daten aus JSON laden
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

// 🔍 Wenn eine Suchanfrage aus der anderen Seite kommt
useEffect(() => {
  if (location.state?.query) {
    setSearchTerm(location.state.query);
  }
}, [location.state]);

  // 🔍 Suche nach Name oder Beschreibung
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

      <input
        type="text"
        placeholder={t("searchPlaceholder")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

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
