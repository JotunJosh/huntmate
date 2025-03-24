import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./SplashScreen.css";

const SplashScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("splashShown", "true");
      navigate("/"); // weiter zur Hauptseite
    }, 2500); // 2,5 Sekunden zeigen

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <img src="logo512.png" alt="HuntMate Logo" className="splash-logo" />
        <h1>{t("splashWelcome")}</h1>
        <p>{t("splashText")}</p>
      </div>
    </div>
  );
};

export default SplashScreen;
