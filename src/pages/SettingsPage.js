// ⚛️ React + Router + i18n
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.css";

// 🛠️ Modal für Update-Status (optional angezeigt)
import UpdateModal from "../components/UpdateModal";

// ⚙️ Hauptkomponente für Einstellungen
const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // 🧠 Lokale Settings-States (aus localStorage oder Defaults)
  const storedDarkMode = localStorage.getItem("darkMode") === "true";
  const [darkMode, setDarkMode] = useState(storedDarkMode);
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("language") || "de");
  const [displayFormat, setDisplayFormat] = useState(localStorage.getItem("displayFormat") || "{name} ({altName}) - {description}");

  // 📦 Für Updates
  const [releaseLog, setReleaseLog] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // 📁 Initiales Setup bei Laden der Seite
  useEffect(() => {
    // 🌙 Dark Mode anwenden
    if (storedDarkMode) {
      document.body.classList.add("dark-mode");
    }

    // 📜 Lade Release-Log (für Anzeige oder Update)
    window.electronAPI?.getReleaseLog?.().then((log) => {
      setReleaseLog(log || t("update.noInfo"));
    });

    // 🔄 Reagiere auf Update-Statusmeldungen
    window.electronAPI?.onUpdateStatus?.((msg) => {
      setUpdateStatus(msg);

      if (msg.includes("App startet neu")) {
        setTimeout(() => setUpdateStatus(""), 5000);
      }

      if (msg.includes("Update verfügbar")) {
        setUpdateAvailable(true);
      }
    });

    // 🧪 Suche nach Updates
    window.electronAPI?.checkForUpdates?.();
  }, []);

  // 🌙 Umschalten des Dark Mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    document.body.classList.toggle("dark-mode", newDarkMode);
  };

  // 🌐 Sprache wechseln
  const changeLanguage = (language) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  };

  // 📝 Anzeigeformat (für Skills) ändern
  const saveDisplayFormat = (event) => {
    const newFormat = event.target.value;
    setDisplayFormat(newFormat);
    localStorage.setItem("displayFormat", newFormat);
  };

  // 🔄 Manueller Update-Check (dev- & release-sicher)
  const handleUpdateCheck = async () => {
    try {
      const isDev = await window.electronAPI?.isDev?.();

      if (isDev) {
        // 🧪 Dev-Modus
        setUpdateStatus(t("update.devSearching"));
        setTimeout(() => {
          setUpdateStatus(t("update.devNoneFound"));
          setTimeout(() => setUpdateStatus(""), 3000);
        }, 2500);
      } else {
        // 🚀 Live-Update prüfen
        setUpdateStatus(t("update.searching"));
        await window.electronAPI?.checkForUpdates?.();

        setTimeout(() => {
          setUpdateStatus(t("update.searchingVersion"));
        }, 1000);

        setTimeout(() => {
          setUpdateStatus((prev) => {
            if (prev.includes("🔄") || prev.includes("gesucht") || prev.includes("searching")) {
              return t("update.noResponse");
            }
            return prev;
          });
          setTimeout(() => setUpdateStatus(""), 4000);
        }, 10000);
      }
    } catch (err) {
      console.error("⚠️ Fehler beim Dev-Check oder Update:", err);
      setUpdateStatus(t("update.error"));
      setTimeout(() => setUpdateStatus(""), 4000);
    }
  };

  return (
    <div className="settings-container">
      {/* 🔄 Optionales Update-Overlay */}
      <UpdateModal status={updateStatus} />

      {/* ⚙️ Überschrift mit optionalem "🆕"-Badge */}
      <h1 className="settings-title">
        {t("settingsTitle")}
        {updateAvailable && <span className="update-badge">🆕 {t("update.availableBadge")}</span>}
      </h1>

      {/* 🌐 Sprachwahl */}
      <div className="settings-section">
        <h2>{t("languageSwitcherTitle")}</h2>
        <div className="button-group">
          <button onClick={() => changeLanguage("de")}>🇩🇪 {t("german")}</button>
          <button onClick={() => changeLanguage("en")}>🇺🇸 {t("english")}</button>
          <button onClick={() => changeLanguage("fr")}>🇫🇷 {t("french")}</button>
        </div>
      </div>

      {/* 📝 Anzeigeformat auswählen */}
      <div className="settings-section">
        <h2>{t("displayFormatLabel")}</h2>
        <select value={displayFormat} onChange={saveDisplayFormat}>
          <option value="{name} ({altName}) - {description}">{t("displayFormatOption1")}</option>
          <option value="{name} ({altName})">{t("displayFormatOption2")}</option>
          <option value="{description} - {name} ({altName})">{t("displayFormatOption3")}</option>
        </select>
      </div>

      {/* 🌙 Dark Mode + Splash Reset */}
      <div className="settings-section">
        <div className="setting-row">
          <label htmlFor="darkToggle" className="setting-label">{t("darkMode")}</label>
          <label className="switch">
            <input id="darkToggle" type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
            <span className="slider round"></span>
          </label>
        </div>

        {/* 🔁 Splash-Reset */}
        <div className="splash-reset-button">
          <button onClick={() => {
            localStorage.removeItem("lastSplashVersion");
            alert(t("resetSplashAlert"));
          }}>
            🔁 {t("resetSplash")}
          </button>
        </div>
      </div>

      {/* 🔽 Update-Bereich (derzeit auskommentiert) */}
      {/*
      <div className="settings-section">
        <h2>🔄 {t("update.title")}</h2>
        <button onClick={handleUpdateCheck}>{t("update.checkNow")}</button>
        <h3>📜 {t("update.logTitle")}</h3>
        <div className={`release-log-box ${darkMode ? "dark" : "light"}`}>{releaseLog}</div>
      </div>
      */}

      {/* 🌍 Externe Links */}
      <div className="settings-section">
        <h2>🌍 {t("externalLinks.title")}</h2>
        <div className="button-group external-links">
          <a
            className="link-button"
            href={`https://github.com/JotunJosh/huntmate/releases/download/v${require('../../package.json').version}/HuntMate-Setup-${require('../../package.json').version}.msi`}
            download
          >
            ⬇️ {t("externalLinks.downloadLatest")}
          </a>
          <button className="link-button" onClick={() => window.electronAPI.openExternalLink("https://github.com/JotunJosh/huntmate/releases")}>
            {t("externalLinks.allReleases")}
          </button>
          <button className="link-button" onClick={() => window.electronAPI.openExternalLink("https://www.nexusmods.com/monsterhunterwilds/mods/612")}>
            {t("externalLinks.nexus")}
          </button>
        </div>
      </div>

      <hr />

      {/* ⬅️ Zurück */}
      <button onClick={() => navigate("/")}>{t("back")}</button>
    </div>
  );
};

export default SettingsPage;
