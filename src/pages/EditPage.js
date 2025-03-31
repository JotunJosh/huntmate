// ⚛️ React + Router + Übersetzungen
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 🔧 Übersichtsseite für alle Bearbeitungsoptionen
// Overview page for all editing options
const EditPage = () => {
  const { t } = useTranslation(); // 🌍 Für Sprachunterstützung
  const navigate = useNavigate(); // 🔁 Zum Wechseln der Seiten

  return (
    <div className="edit-page-container">
      {/* 📝 Überschrift */}
      <h1>{t("editTitle")}</h1>

      {/* 🔎 Untertitel mit Beschreibung */}
      <p className="edit-subtext">
        {t("chooseEditMode") || "Bitte wähle aus, was du bearbeiten möchtest:"}
      </p>

      {/* 🧭 Navigation zu den einzelnen Bearbeitungsbereichen */}
      <div className="edit-button-group">
        <button className="edit-nav-button" onClick={() => navigate("/Editskill")}>
          🧠 {t("editSkills") || "Skills bearbeiten"}
        </button>

        <button className="edit-nav-button" onClick={() => navigate("/EditSkillDetails")}>
          📦 {t("editSkillDetails") || "Skill-Details bearbeiten"}
        </button>

        <button className="edit-nav-button" onClick={() => navigate("/Ediddeco")}>
          💎 {t("editDecos") || "Dekorationen bearbeiten"}
        </button>
      </div>

      {/* 🔙 Zurück zur Startseite */}
      <button className="back-button" onClick={() => navigate("/")}>
        ⬅️ {t("back")}
      </button>
    </div>
  );
};

export default EditPage;
