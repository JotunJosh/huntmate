const { app, Menu ,BrowserWindow, ipcMain } = require("electron");
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
    },
  });

  // 🔹 Menüleiste komplett entfernen
  Menu.setApplicationMenu(null); // ✅ Standard-Menü ausblenden
  mainWindow.setMenuBarVisibility(false); // ✅ Auch ALT-Drücken verhindert Anzeige
  mainWindow.removeMenu(); // ✅ Menü komplett aus der App entfernen

  let finalPath;

  if (app.isPackaged) {
    // ✅ Korrigierter Pfad für die verpackte App
    finalPath = path.join(process.resourcesPath, "app", "build", "index.html");
  } else {
    // ✅ Korrigierter Pfad für den Entwicklermodus
    finalPath = "build/index.html";
  }

  console.log("📂 Lade Datei:", finalPath); // Debug-Ausgabe

  mainWindow.loadFile(finalPath).catch((err) => {
    console.error("❌ Ladefehler:", err);
  });
}

// 📌 IPC-Handler für Datei-Operationen
ipcMain.handle("getDataPath", () => {
  const dataPath = app.isPackaged
    ? path.join(process.resourcesPath, "app" , "data.json") // 📦 Richtiger Pfad nach dem Build
    : path.join("data.json"); // 🛠 Richtiger Pfad im Entwicklermodus

  console.log("📂 Sende Datenpfad:", dataPath);
  return dataPath;
});

ipcMain.handle("getDecoDataPath", () => {
  const decoDataPath = app.isPackaged
    ? path.join(process.resourcesPath, "app", "data-decos.json") // 📦 Richtiger Pfad nach dem Build
    : path.join("data-decos.json"); // 🛠 Richtiger Pfad im Entwicklermodus

  console.log("📂 Sende Datenpfad:", decoDataPath);
  return decoDataPath;
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

// app.whenReady().then(() => {
//   createWindow();
// });

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
