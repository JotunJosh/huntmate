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
import EditDecos from "./pages/EditDecos";
import SplashScreen from "./pages/SplashScreen";

import "./App.css";

function App() {
  const { t } = useTranslation();
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // 🌙 Dark Mode direkt beim Start setzen
    const storedDarkMode = localStorage.getItem("darkMode") === "true";
    document.body.classList.toggle("dark-mode", storedDarkMode);

    // 🖼 Splash-Screen zeigen, wenn noch nie gezeigt
    const alreadyShown = localStorage.getItem("splashShown");
    if (!alreadyShown) {
      setShowSplash(true);
      setTimeout(() => {
        localStorage.setItem("splashShown", "true");
        setShowSplash(false);
      }, 5000); // Splashscreen Dauer in ms
    }
  }, []);

  return (
    <Router>
      <div>
        {showSplash ? (
          <SplashScreen />
        ) : (
          <>
            <AppHeader />

            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/edit" element={<EditPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/build" element={<BuildSkillsPage />} />
              <Route path="/deco" element={<DecoSearchPage />} />
              <Route path="/Editskill" element={<EditSkills />} />
              <Route path="/Ediddeco" element={<EditDecos />} />
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
              © 2025 HuntMate – {t("copyright")} – Version 2.3.0
            </footer>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
