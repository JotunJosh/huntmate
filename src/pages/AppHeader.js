import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../App.css";

const AppHeader = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <header className="app-header">
      <div className="nav-left">
        <button className={isActive("/")} onClick={() => navigate("/")}>
          🧠 {t("searchTitle")}
        </button>
        <button className={isActive("/deco")} onClick={() => navigate("/deco")}>
          💎 {t("decoSearchTitle")}
        </button>
        <button className={isActive("/build")} onClick={() => navigate("/build")}>
          🧱 {t("viewBuildSkills")}
        </button>
        <button className={isActive("/edit")} onClick={() => navigate("/edit")}>
          🛠 {t("editMode")}
        </button>
      </div>

      <div className="nav-right">
        <button className={isActive("/settings")} onClick={() => navigate("/settings")}>
          ⚙️
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
