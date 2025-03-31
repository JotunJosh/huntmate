// ⚛️ React + Routing + i18n
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../App.css"; // 🎨 Importiere globale Styles

// 🔼 Navigationsleiste oben in der App
// Top navigation bar of the app
const AppHeader = () => {
  const navigate = useNavigate(); // 🔀 Zum Programmatischen Navigieren
  const { t } = useTranslation(); // 🌐 Übersetzungen laden
  const location = useLocation(); // 🧭 Aktuelle Route ermitteln

  /**
   * 🧠 Gibt CSS-Klasse zurück, abhängig davon,
   * ob die Route aktiv ist oder nicht.
   * Returns active/inactive class for nav buttons.
   */
  const isActive = (path) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <header className="app-header">
      {/* 🔹 Linke Seite der Navigation */}
      {/* Left side navigation group */}
      <div className="nav-left">
        <button className={isActive("/")} onClick={() => navigate("/")}>
          🧠 {t("searchTitle")} {/* z. B. „Skillsuche“ */}
        </button>
        <button className={isActive("/deco")} onClick={() => navigate("/deco")}>
          💎 {t("decoSearchTitle")} {/* z. B. „Dekorationen suchen“ */}
        </button>
        <button className={isActive("/build")} onClick={() => navigate("/build")}>
          🧱 {t("viewBuildSkills")} {/* z. B. „Build anzeigen“ */}
        </button>
        <button className={isActive("/edit")} onClick={() => navigate("/edit")}>
          🛠 {t("editMode")} {/* z. B. „Bearbeiten“ */}
        </button>
      </div>

      {/* 🔹 Rechte Seite der Navigation */}
      {/* Right side navigation (e.g. Settings) */}
      <div className="nav-right">
        <button className={isActive("/settings")} onClick={() => navigate("/settings")}>
          ⚙️ {/* Einstellungen */}
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
