// ⚛️ React & Portals
import React from "react";
import ReactDOM from "react-dom";

/**
 * 💬 Tooltip-Komponente für statische Infos
 * Tooltip component for showing contextual information (e.g. skill effects)
 * 
 * @param {ReactNode} children - Inhalt des Tooltips / Tooltip content
 * @param {Object} position - { top, left } – Tooltip-Position relativ zum Auslöser
 */
const Tooltip = ({ children, position }) => {
  // ❌ Wenn keine Position übergeben wurde, nichts anzeigen
  // Don't render anything if there's no position
  if (!position) return null;

  // 🎨 Style des Tooltips (direkt im Component-Scope definiert)
  // Inline styling for the floating tooltip box
  const style = {
    position: "fixed",              // 🔒 Bleibt an fester Stelle im Fenster
    top: position.top + 8,         // 🧷 leicht unterhalb vom Auslöser
    left: position.left,
    zIndex: 99999,                 // 🔝 ganz oben
    background: "rgba(30,30,30,0.95)", // 🌙 dunkler Hintergrund
    padding: "8px 12px",           // 📐 Innenabstand
    color: "#f5f2eb",              // ✍️ Beiger Text
    borderRadius: "6px",           // 🟦 leicht abgerundete Ecken
    fontSize: "13px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)", // 🕶️ dezenter Schatten
    maxWidth: "300px",
    whiteSpace: "pre-line",        // ⏎ Zeilenumbrüche aus Text übernehmen
    pointerEvents: "none"          // 🖱️ Maus geht durch (nicht blockierend)
  };

  // 📦 Tooltip wird per Portal direkt in den <body> eingefügt
  // Use a portal to render the tooltip outside the component tree
  return ReactDOM.createPortal(
    <div style={style}>{children}</div>,
    document.body
  );
};

export default Tooltip;
