// ⚛️ React Basics
import React, { useEffect, useState } from "react";

/**
 * 🔄 Komponente zur Anzeige von Update-Statusnachrichten
 * Component that shows live update status messages (e.g. during auto-update process)
 */
function UpdateStatusOverlay() {
  const [status, setStatus] = useState(""); // 📦 Aktueller Text der Statusmeldung

  useEffect(() => {
    // 🛰️ Hört auf Statusänderungen vom Electron-Main-Prozess
    if (window.electronAPI?.onUpdateStatus) {
      window.electronAPI.onUpdateStatus((msg) => {
        setStatus(msg);
      });
    }
  }, []);

  // ❌ Wenn kein Status vorhanden → nichts anzeigen
  if (!status) return null;

  // ✅ Sichtbare Statusanzeige unten links im Fenster
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        background: "#222",
        color: "#fff",
        padding: "1rem",
        borderRadius: "8px",
        fontSize: "0.9rem",
        zIndex: 1000,
      }}
    >
      {status}
    </div>
  );
}

export default UpdateStatusOverlay;
