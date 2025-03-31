// ⚛️ React, Übersetzung, Styles, Animationen
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./UpdateModal.css";
import Lottie from "lottie-react";

// 🔄 Lottie-Animationsdatei + Monster-Grafik
import updateAnimation from "../assets/lottie/update-animation.json";
import monsterSvg from "../assets/monster/monster-shadow.png";

// 💬 Modal zur Anzeige des Update-Status
// Modal that shows current update state + optional details
const UpdateModal = ({ status }) => {
  const { t } = useTranslation();

  // 📦 Lokale States
  const [showInfo, setShowInfo] = useState(false);  // Toggle für Zusatzinfo
  const [visible, setVisible] = useState(true);     // Sichtbarkeit des Modals

  // ⏱️ Automatisch schließen, wenn kein "Update verfügbar"-Text vorhanden
  useEffect(() => {
    if (!status) return;

    const isImportant = status.includes("verfügbar") || status.includes("Update");

    if (!isImportant) {
      const timeout = setTimeout(() => setVisible(false), 4000); // automatisch ausblenden
      return () => clearTimeout(timeout);
    } else {
      setVisible(true); // sichtbar lassen bei echter Update-Meldung
    }
  }, [status]);

  // ❌ Kein Status oder Modal bereits geschlossen → gar nicht anzeigen
  if (!status || !visible) return null;

  return (
    <div
      className="update-modal-overlay monster-theme"
      onClick={() => setShowInfo(!showInfo)} // Klick toggelt Zusatzinfos
      title={t("updateModal.clickForInfo")}
    >
      {/* 👾 Atmosphäre: Leichtes Monster-Bild im Hintergrund */}
      <img src={monsterSvg} alt="Monster" className="monster-background" />

      <div className="update-modal monster-glow">
        <h3>{t("updateModal.title")}</h3>

        {/* 🔄 Animation (z. B. Ladespinner) */}
        <Lottie
          animationData={updateAnimation}
          loop
          style={{ width: 150, margin: "1rem auto" }}
        />

        {/* 📋 Statusnachricht */}
        <p>{status}</p>

        <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
          {t("updateModal.clickHint")}
        </p>

        {/* 🔓 Erweiterte Infos nur bei Klick sichtbar */}
        {showInfo && (
          <div className="update-details">
            <p><strong>{t("updateModal.infoTitle")}</strong></p>
            <p>{t("updateModal.infoText")}</p>

            <div className="button-row">
              {/* 🔗 Link zu GitHub Releases */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // verhindert Modal-Schließen
                  window.electronAPI?.openExternalLink("https://github.com/JotunJosh/huntmate/releases");
                }}
              >
                🔗 {t("updateModal.openGithub")}
              </button>

              {/* ⬇ Direkter MSI-Download */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.electronAPI?.openExternalLink("https://github.com/JotunJosh/huntmate/releases/latest/download/HuntMate-Setup-latest.msi");
                }}
              >
                ⬇ {t("updateModal.downloadMsi")}
              </button>
            </div>

            {/* ❌ Modal schließen */}
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
