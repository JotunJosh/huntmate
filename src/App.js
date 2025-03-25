import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";

import SearchPage from "./pages/SearchPage";
import EditPage from "./pages/EditPage";
import SettingsPage from "./pages/SettingsPage";
import BuildSkillsPage from "./pages/BuildSkillsPage";
import DecoSearchPage from "./pages/DecoSearchPage";
import AppHeader from "./pages/AppHeader";
import EditSkills from "./pages/EditSkills";
import EditSkillDetails from "./pages/EditSkillDetails";
import EditDecos from "./pages/EditDecos";
import SplashScreen from "./pages/SplashScreen";

import "./App.css";

function App() {
  const { t, i18n } = useTranslation();
  const [showSplash, setShowSplash] = useState(false);
  const [loadingDone, setLoadingDone] = useState(false);
  const [appVersion, setAppVersion] = useState("...");

  useEffect(() => {
    // 🌙 Dark Mode beim Start setzen
    const storedDarkMode = localStorage.getItem("darkMode") === "true";
    document.body.classList.toggle("dark-mode", storedDarkMode);

    // 🌐 Sprache beim Start setzen
    const storedLanguage = localStorage.getItem("language") || "de";
    i18n.changeLanguage(storedLanguage);

    // 🖼 SplashScreen auf Basis der App-Version
    async function checkSplashVersion() {
      console.log("🔍 Starte SplashCheck...");

      let currentVersion = null;
      try {
        currentVersion = await window.electronAPI?.getAppVersion?.();
        console.log("📦 App-Version:", currentVersion);
      } catch (err) {
        console.warn("⚠️ Konnte App-Version nicht abrufen!", err);
      }

      const lastSplashVersion = localStorage.getItem("lastSplashVersion");
      console.log("💾 Zuletzt angezeigte Version:", lastSplashVersion);

      if (!lastSplashVersion || lastSplashVersion !== currentVersion) {
        console.log("🌊 Splash wird angezeigt!");
        setShowSplash(true);

        setTimeout(() => {
          console.log("✅ Splash fertig – weiter zur App.");
          if (currentVersion) {
            localStorage.setItem("lastSplashVersion", currentVersion);
          }
          setShowSplash(false);
          setLoadingDone(true);
        }, 5000);
      } else {
        console.log("🔁 Splash nicht nötig – Version unverändert.");
        setLoadingDone(true);
      }

      if (currentVersion) {
        setAppVersion(currentVersion);
      }
    }

    checkSplashVersion();
  }, []);

  if (showSplash) {
    console.log("🌊 SplashScreen wird gerendert!");
    return <SplashScreen />;
  }

  if (!loadingDone) {
    console.log("⏳ Warte auf Splash-Freigabe...");
    return null;
  }

  return (
    <Router>
      <div>
        <AppHeader />
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/edit" element={<EditPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/build" element={<BuildSkillsPage />} />
          <Route path="/deco" element={<DecoSearchPage />} />
          <Route path="/Editskill" element={<EditSkills />} />
          <Route path="/Ediddeco" element={<EditDecos />} />
          <Route path="/EditSkillDetails" element={<EditSkillDetails />} />
        </Routes>
        <footer
          style={{
            textAlign: "center",
            padding: "10px",
            background: "#222",
            color: "#fff",
            marginTop: "30px",
          }}
        >
          © 2025 HuntMate – {t("copyright")} – Version {appVersion}
        </footer>
      </div>
    </Router>
  );
}

export default App;
