import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EditPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="edit-page-container">
      <h1>{t("editTitle")}</h1>
      <p className="edit-subtext">
        {t("chooseEditMode") || "Bitte wähle aus, was du bearbeiten möchtest:"}
      </p>

      <div className="edit-button-group">
        <button className="edit-nav-button" onClick={() => navigate("/Editskill")}>
          🧠 {t("editSkills") || "Skills bearbeiten"}
        </button>
        <button className="edit-nav-button" onClick={() => navigate("/Ediddeco")}>
          💎 {t("editDecos") || "Dekorationen bearbeiten"}
        </button>
      </div>

      <button className="back-button" onClick={() => navigate("/")}>
        ⬅️ {t("back")}
      </button>
    </div>
  );
};

export default EditPage;
