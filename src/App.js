// ⚛️ React & Routing Basics
import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 🧩 App-Seiten (Pages)
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

// 🔄 Update-Meldungen (Overlay während Update-Prozess)
import UpdateStatusOverlay from "./components/UpdateStatusOverlay"; // ✅ bleibt

import "./App.css"; // 🎨 Globale Styles

function App() {
  const { t, i18n } = useTranslation();

  // 🔁 Splash Screen Handling
  const [showSplash, setShowSplash] = useState(false);
  const [loadingDone, setLoadingDone] = useState(false);

  // 🧾 Version für Footer
  const [appVersion, setAppVersion] = useState("...");

  useEffect(() => {
    // 🌒 Dark Mode beim Start anwenden
    const storedDarkMode = localStorage.getItem("darkMode") === "true";
    document.body.classList.toggle("dark-mode", storedDarkMode);

    // 🌐 Sprache aus localStorage setzen (Standard: "de")
    const storedLanguage = localStorage.getItem("language") || "de";
    i18n.changeLanguage(storedLanguage);

    // 🌊 Splashscreen anzeigen, wenn Version neu ist
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
        // ➕ Splash zeigen, weil Version neu ist
        console.log("🌊 Splash wird angezeigt!");
        setShowSplash(true);

        setTimeout(() => {
          console.log("✅ Splash fertig – weiter zur App.");
          if (currentVersion) {
            localStorage.setItem("lastSplashVersion", currentVersion);
          }
          setShowSplash(false);
          setLoadingDone(true);
        }, 5000); // Splash-Dauer: 5 Sekunden
      } else {
        // ➖ Splash nicht nötig, Version gleich
        console.log("🔁 Splash nicht nötig – Version unverändert.");
        setLoadingDone(true);
      }

      if (currentVersion) {
        setAppVersion(currentVersion);
      }
    }

    checkSplashVersion();
  }, []);

  // 🌊 Splashscreen wird gerendert
  if (showSplash) {
    console.log("🌊 SplashScreen wird gerendert!");
    return <SplashScreen />;
  }

  // ⏳ Warte, bis Splash abgeschlossen ist
  if (!loadingDone) {
    console.log("⏳ Warte auf Splash-Freigabe...");
    return null;
  }

  // 🔁 Haupt-Layout & Seitenstruktur
  return (
    <Router>
      <div>
        {/* 🔄 Zeigt Update-Status dauerhaft oben an */}
        <UpdateStatusOverlay />

        {/* 📌 App-Header mit Navigation etc. */}
        <AppHeader />

        {/* 🔀 Seitenrouting */}
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

        {/* 📜 Footer mit App-Name, Copyright und Version */}
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
