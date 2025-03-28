console.log("✅ Preload-Skript wurde ausgeführt!");

const { contextBridge, ipcRenderer, shell } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // 🌐 Externe Links
openExternalLink: (url) => shell.openExternal(url),

  // 📂 Pfade
  getDataPath: () => ipcRenderer.invoke("getDataPath"),
  getDecoDataPath: () => ipcRenderer.invoke("getDecoDataPath"),
  getSkillDetailsPath: (lang) => ipcRenderer.invoke("getSkillDetailsPath", lang),

  // 📦 Version / Release
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  getReleaseLog: () => ipcRenderer.invoke("get-release-log"),
  checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),

  // 🔄 Updater
  onUpdateStatus: (callback) => ipcRenderer.on("update-status", (_, message) => callback(message)),



  // 🧰 Dateioperationen
  fileExists: (filePath) => ipcRenderer.invoke("fileExists", filePath),
  readFile: (filePath) => ipcRenderer.invoke("readFile", filePath),
  writeFile: (filePath, data) => ipcRenderer.invoke("writeFile", filePath, data),

  // 🧪 Dev-Modus über IPC
  isDev: () => ipcRenderer.invoke("is-dev"),
});

// 🧪 Dev-Modus auch als Fallback (nur für Notfälle)
contextBridge.exposeInMainWorld("appInfo", {
  isDev: !process.env.NODE_ENV || process.env.NODE_ENV === "development"
});
