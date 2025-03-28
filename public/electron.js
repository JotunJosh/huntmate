const { app, Menu, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater"); // ⬅️ hinzugefügt
const fs = require("fs");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(app.getAppPath(), "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // 🔹 Menüleiste komplett entfernen
  Menu.setApplicationMenu(null);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.removeMenu();

  let finalPath;

  if (app.isPackaged) {
    finalPath = path.join(process.resourcesPath, "app", "build", "index.html");
  } else {
    finalPath = "build/index.html";
  }

  console.log("📂 Lade Datei:", finalPath);

  mainWindow.loadFile(finalPath).catch((err) => {
    console.error("❌ Ladefehler:", err);
  });
}

// 📦 Auto-Updater aktivieren, sobald App bereit ist
app.whenReady().then(() => {
  createWindow();

  // 🔄 Prüfe auf Updates & lade automatisch herunter
  autoUpdater.checkForUpdatesAndNotify();

  // 💬 Debug-Ausgaben
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
  
    // Nur im Entwicklermodus: Modal nach ein paar Sekunden schließen
    if (!app.isPackaged) {
      setTimeout(() => {
        mainWindow.webContents.send("update-status", "");
      }, 5000);
    }
  
    setTimeout(() => {
      autoUpdater.quitAndInstall();
    }, 3000);
  });  
});

// 📌 IPC-Handler
ipcMain.handle("getDataPath", () => {
  const dataPath = app.isPackaged
    ? path.join(process.resourcesPath, "app", "data.json")
    : path.join("data.json");
  return dataPath;
});

ipcMain.handle("getDecoDataPath", () => {
  const decoDataPath = app.isPackaged
    ? path.join(process.resourcesPath, "app", "data-decos.json")
    : path.join("data-decos.json");
  return decoDataPath;
});

ipcMain.handle("getSkillDetailsPath", (_, lang) => {
  const fileName = `skills_${lang}.json`;
  const filePath = app.isPackaged
    ? path.join(process.resourcesPath, "app", fileName)
    : path.join(fileName);
  return filePath;
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

// 🔻 MacOS-Standardverhalten
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

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