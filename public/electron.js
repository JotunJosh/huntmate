// ⚙️ Electron Core Module & Node.js-Funktionen
const { app, Menu, BrowserWindow, ipcMain, shell } = require("electron");
const { autoUpdater } = require("electron-updater"); // ⬅️ Automatische Updates
const fs = require("fs");
const path = require("path");

// 🪟 Hauptfenster erstellen
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: app.isPackaged
        ? path.join(process.resourcesPath, "preload.js")
        : path.join(__dirname, "..", "preload.js")
    },
  });

  Menu.setApplicationMenu(null);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.removeMenu();

  const finalPath = app.isPackaged
  ? path.join(app.getAppPath(), "build", "index.html") // 💡 DER sichere Weg
  : path.join(__dirname, "..", "build", "index.html");

  console.log("📂 Lade Datei:", finalPath);

  mainWindow.loadFile(finalPath).catch((err) => {
    console.error("❌ Ladefehler:", err);
  });

  // mainWindow.webContents.openDevTools();

  return mainWindow;
};


// 🚀 App starten + Auto-Updater konfigurieren
app.whenReady().then(() => {
  const mainWindow = createWindow();

  // ⬇️ Update prüfen & ggf. automatisch herunterladen
  autoUpdater.checkForUpdatesAndNotify();

  // 📝 Statusmeldungen im Terminal ausgeben
  autoUpdater.on("checking-for-update", () => {
    console.log("🔍 Suche nach Updates...");
  });

  autoUpdater.on("update-available", () => {
    console.log("🚀 Update verfügbar!");
  });

  autoUpdater.on("update-not-available", () => {
    console.log("✅ App ist aktuell.");
  });

  autoUpdater.on("error", (err) => {
    console.error("❌ Fehler beim Update:", err);
  });

  autoUpdater.on("download-progress", (progressObj) => {
    console.log(`⬇️ Lade Update... ${Math.round(progressObj.percent)}%`);
  });

  autoUpdater.on("update-downloaded", () => {
    mainWindow.webContents.send("update-status", "✅ Update fertig. App startet neu…");

    // ⏱ Nur in Entwicklung: Modal automatisch schließen
    if (!app.isPackaged) {
      setTimeout(() => {
        mainWindow.webContents.send("update-status", "");
      }, 5000);
    }

    // 🔁 App neustarten und Update anwenden
    setTimeout(() => {
      autoUpdater.quitAndInstall();
    }, 3000);
  });
});

// 🛠 IPC-Kommandos für Renderer-Prozess (electronAPI)
ipcMain.handle("getDataPath", () => {
  return app.isPackaged
    ? path.join(process.resourcesPath, "data.json")           // <== geändert
    : path.join(__dirname, "..", "data.json");
});

ipcMain.handle("getDecoDataPath", () => {
  return app.isPackaged
    ? path.join(process.resourcesPath, "data-decos.json")     // <== geändert
    : path.join(__dirname, "..", "data-decos.json");
});

ipcMain.handle("getSkillDetailsPath", (_, lang) => {
  const fileName = `skills_${lang}.json`;
  return app.isPackaged
    ? path.join(process.resourcesPath, fileName)              // <== geändert
    : path.join(__dirname, "..", fileName);
});

ipcMain.handle("open-external-link", (event, url) => {
  return shell.openExternal(url);
});

ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

ipcMain.handle("fileExists", (event, filePath) => {
  return fs.existsSync(filePath);
});

ipcMain.handle("readFile", (event, filePath) => {
  return fs.readFileSync(filePath, "utf8");
});

ipcMain.handle("writeFile", (event, filePath, data) => {
  fs.writeFileSync(filePath, data, "utf8");
  return true;
});

// 📜 RELEASE_LOG.md ausliefern
const logFilePath = app.isPackaged
  ? path.join(process.resourcesPath, "app", "RELEASE_LOG.md")
  : path.join("RELEASE_LOG.md");

ipcMain.handle("get-release-log", () => {
  try {
    return fs.readFileSync(logFilePath, "utf8");
  } catch (err) {
    return "Keine Release-Infos gefunden.";
  }
});

ipcMain.handle("check-for-updates", () => {
  autoUpdater.checkForUpdatesAndNotify();
  return true;
});

ipcMain.handle("is-dev", () => {
  return !app.isPackaged;
});

// 🍏 macOS-Spezialfall: App offen halten, bis explizit beendet
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
