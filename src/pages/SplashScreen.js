import React from "react";
import "./SplashScreen.css";
import { useTranslation } from "react-i18next";

const SplashScreen = () => {
  const { t } = useTranslation();

  return (
    <div className="splash-screen stylish-splash">
      <div className="splash-glow"></div>

      <div className="splash-icon">
        <img
          src="huntmate-splash-logo.png"
          alt="HuntMate Emblem"
          className="splash-logo-image"
        />
      </div>

      <h1>{t("splashWelcome")}</h1>
      <p>{t("splashText")}</p>
      <div className="spinner"></div>
    </div>
  );
};

export default SplashScreen;
