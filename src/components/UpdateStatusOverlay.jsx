import React, { useEffect, useState } from "react";

function UpdateStatusOverlay() {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (window.electronAPI?.onUpdateStatus) {
      window.electronAPI.onUpdateStatus((msg) => {
        setStatus(msg);
      });
    }
  }, []);

  if (!status) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 20,
      left: 20,
      background: "#222",
      color: "#fff",
      padding: "1rem",
      borderRadius: "8px",
      fontSize: "0.9rem",
      zIndex: 1000
    }}>
      {status}
    </div>
  );
}

export default UpdateStatusOverlay;
