import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.css"; // Falls Styles hier ausgelagert sind

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  // 🌙 Dark Mode direkt aus `localStorage` setzen
  const storedDarkMode = localStorage.getItem("darkMode") === "true";
  const [darkMode, setDarkMode] = useState(storedDarkMode);

  // 🌍 Sprache laden
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("language") || "de"
  );

  // 🔹 Anzeigeformate
  const displayFormats = {
    format1: "{name} ({altName}) - {description}",
    format2: "{name} ({altName})",
    format3: "{description} - {name} ({altName})"
  };
  
  const [displayFormat, setDisplayFormat] = useState(
    localStorage.getItem("displayFormat") || displayFormats.format1
  );

  // ✅ Dark Mode direkt beim App-Start setzen!
  useEffect(() => {
    if (storedDarkMode) {
      document.body.classList.add("dark-mode");
    }
  }, []);

  // 🌙 Dark Mode Toggle mit sofortiger Anwendung
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);

    if (newDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  const changeLanguage = (language) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  };

  const saveDisplayFormat = (event) => {
    const newFormat = event.target.value;
    setDisplayFormat(newFormat);
    localStorage.setItem("displayFormat", newFormat);
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">{t("settingsTitle")}</h1>
      
      {/* 🔹 Sprachumschaltung */}
      <div className="settings-section">
        <h2>{t("languageSwitcherTitle")}</h2>
        <div className="button-group">
          <button onClick={() => changeLanguage("de")}>🇩🇪 {t("german")}</button>
          <button onClick={() => changeLanguage("en")}>🇺🇸 {t("english")}</button>
          <button onClick={() => changeLanguage("fr")}>🇫🇷 {t("french")}</button>
        </div>
      </div>

      {/* 🔹 Anzeigeformat */}
      <div className="settings-section">
        <h2>{t("displayFormatLabel")}</h2>
        <select value={displayFormat} onChange={saveDisplayFormat}>
          <option value={displayFormats.format1}>{t("displayFormatOption1")}</option>
          <option value={displayFormats.format2}>{t("displayFormatOption2")}</option>
          <option value={displayFormats.format3}>{t("displayFormatOption3")}</option>
        </select>
      </div>

      {/* 🔹 Dark Mode mit Toggle nebeneinander */}
            <div className="settings-section">
        <div className="setting-row">
          <label htmlFor="darkToggle" className="setting-label">{t("darkMode")}</label>
          <label className="switch">
            <input
              id="darkToggle"
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="splash-reset-button">
          <button onClick={() => {
            localStorage.removeItem("lastSplashVersion");
            alert("Der SplashScreen wird beim nächsten Start erneut angezeigt.");
          }}>
            🔁 {t("resetSplash") || "SplashScreen zurücksetzen"}
          </button>
        </div>
      </div>

      <hr />
      <button onClick={() => navigate("/")}>{t("back")}</button>
    </div>
  );
};

export default SettingsPage;
