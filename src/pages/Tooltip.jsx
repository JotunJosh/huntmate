import React from "react";
import ReactDOM from "react-dom";

const Tooltip = ({ children, position }) => {
  if (!position) return null;

  const style = {
    position: "fixed",
    top: position.top + 8,
    left: position.left,
    zIndex: 99999,
    background: "rgba(30,30,30,0.95)",
    padding: "8px 12px",
    color: "#f5f2eb",
    borderRadius: "6px",
    fontSize: "13px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    maxWidth: "300px",
    whiteSpace: "pre-line",
    pointerEvents: "none"
  };

  return ReactDOM.createPortal(
    <div style={style}>{children}</div>,
    document.body
  );
};

export default Tooltip;
