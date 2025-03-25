console.log("✅ Preload-Skript wurde ausgeführt!");

const { contextBridge, ipcRenderer, app } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // 📂 Pfad zur Skill-Datenbank
  getDataPath: () => ipcRenderer.invoke("getDataPath"),
  
  // 📂 Pfad zur Deko-Datenbank
  getDecoDataPath: () => ipcRenderer.invoke("getDecoDataPath"),

  // 📂 Pfad zur Skill-Details-Datenbank
  getSkillDetailsPath: (lang) => ipcRenderer.invoke("getSkillDetailsPath", lang),

   // 📂 Aktuelle Version aus der Package holen
   getAppVersion: () => ipcRenderer.invoke("get-app-version"),

  // 🧰 Allgemeine Dateioperationen (für beide verwendbar)
  fileExists: (filePath) => ipcRenderer.invoke("fileExists", filePath),
  readFile: (filePath) => ipcRenderer.invoke("readFile", filePath),
  writeFile: (filePath, data) => ipcRenderer.invoke("writeFile", filePath, data),
});
