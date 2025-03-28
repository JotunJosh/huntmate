import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./UpdateModal.css";
import Lottie from "lottie-react";
import updateAnimation from "../assets/lottie/update-animation.json";
import monsterSvg from "../assets/monster/monster-shadow.png";

const UpdateModal = ({ status }) => {
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!status) return;

    if (!status.includes("verfügbar") && !status.includes("Update")) {
      const timeout = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timeout);
    } else {
      setVisible(true);
    }
  }, [status]);

  if (!status || !visible) return null;

  return (
    <div
      className="update-modal-overlay monster-theme"
      onClick={() => setShowInfo(!showInfo)}
      title={t("updateModal.clickForInfo")}
    >
      <img src={monsterSvg} alt="Monster" className="monster-background" />
      <div className="update-modal monster-glow">
        <h3>{t("updateModal.title")}</h3>
        <Lottie
          animationData={updateAnimation}
          loop
          style={{ width: 150, margin: "1rem auto" }}
        />
        <p>{status}</p>
        <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>{t("updateModal.clickHint")}</p>

        {showInfo && (
          <div className="update-details">
            <p><strong>{t("updateModal.infoTitle")}</strong></p>
            <p>{t("updateModal.infoText")}</p>
            <div className="button-row">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.electronAPI?.openExternalLink("https://github.com/JotunJosh/huntmate/releases");
                }}
              >
                🔗 {t("updateModal.openGithub")}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.electronAPI?.openExternalLink("https://github.com/JotunJosh/huntmate/releases/latest/download/HuntMate-Setup-latest.msi");
                }}
              >
                ⬇ {t("updateModal.downloadMsi")}
              </button>
            </div>
            <button
              className="close-button"
              onClick={(e) => {
                e.stopPropagation();
                setVisible(false);
              }}
            >
              ✖ {t("updateModal.close")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateModal;