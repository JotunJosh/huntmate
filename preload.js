console.log("✅ Preload-Skript wurde ausgeführt!");

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // 📂 Pfad zur Skill-Datenbank
  getDataPath: () => ipcRenderer.invoke("getDataPath"),
  
  // 📂 Pfad zur Deko-Datenbank
  getDecoDataPath: () => ipcRenderer.invoke("getDecoDataPath"),

  // 🧰 Allgemeine Dateioperationen (für beide verwendbar)
  fileExists: (filePath) => ipcRenderer.invoke("fileExists", filePath),
  readFile: (filePath) => ipcRenderer.invoke("readFile", filePath),
  writeFile: (filePath, data) => ipcRenderer.invoke("writeFile", filePath, data),
});
