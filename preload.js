// ✅ Preload-Skript erfolgreich geladen
console.log("✅ Preload-Skript wurde ausgeführt!");

const { contextBridge, ipcRenderer, shell } = require("electron");

/**
 * 🌉 Exponiert Funktionen aus dem Main-Prozess im sicheren Kontext des Frontends.
 * Exposes safe IPC functions to the renderer process using contextBridge.
 */
contextBridge.exposeInMainWorld("electronAPI", {
  // 🌐 Öffnet externe Links im Standardbrowser
  // Opens external links in the user's default browser
  openExternalLink: (url) => shell.openExternal(url),

  // 📂 Gibt den Pfad zur Hauptdaten-Datei zurück (data.json)
  // Returns the path to the main data file (data.json)
  getDataPath: () => ipcRenderer.invoke("getDataPath"),

  // 📂 Gibt den Pfad zur Dekorationsdatei zurück
  // Returns the path to the decorations data file
  getDecoDataPath: () => ipcRenderer.invoke("getDecoDataPath"),

  // 📂 Gibt den Pfad zur Sprachdatei für Skill-Details zurück (abhängig von Sprache)
  // Returns the path to the skill details file for a given language
  getSkillDetailsPath: (lang) => ipcRenderer.invoke("getSkillDetailsPath", lang),

  // 📦 Gibt die aktuelle App-Version zurück
  // Returns the current app version
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),

  // 📋 Gibt den Änderungsverlauf (Changelog) der App zurück
  // Returns the release log of the app
  getReleaseLog: () => ipcRenderer.invoke("get-release-log"),

  // 🔍 Prüft, ob ein neues Update verfügbar ist
  // Checks if an update is available
  checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),

  // 🔄 Empfängt Statusmeldungen vom Updater (z. B. für Fortschrittsanzeigen)
  // Receives status messages from the updater (e.g., for progress display)
  onUpdateStatus: (callback) =>
    ipcRenderer.on("update-status", (_, message) => callback(message)),

  // 🧰 Prüft, ob eine Datei existiert
  // Checks if a file exists
  fileExists: (filePath) => ipcRenderer.invoke("fileExists", filePath),

  // 🧰 Liest eine Datei (z. B. JSON)
  // Reads a file (e.g., JSON)
  readFile: (filePath) => ipcRenderer.invoke("readFile", filePath),

  // 🧰 Schreibt Daten in eine Datei
  // Writes data to a file
  writeFile: (filePath, data) => ipcRenderer.invoke("writeFile", filePath, data),

  // 🧪 Gibt zurück, ob die App im Entwicklungsmodus läuft
  // Returns whether the app is running in development mode
  isDev: () => ipcRenderer.invoke("is-dev"),
});

/**
 * 🧪 Fallback: Entwicklungsmodus direkt im Fenster verfügbar machen
 * (nur wenn kein contextBridge Zugriff möglich ist)
 * Fallback to provide development mode info directly in the window
 */
contextBridge.exposeInMainWorld("appInfo", {
  isDev: !process.env.NODE_ENV || process.env.NODE_ENV === "development"
});
