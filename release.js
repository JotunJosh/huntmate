const fs = require("fs");
const { execSync } = require("child_process");
const readline = require("readline");
require("dotenv").config();

const pkgPath = "package.json";
const logPath = "RELEASE_LOG.md";
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

const args = process.argv.slice(2);
const bumpType = args[0] || "patch";

let [major, minor, patch] = pkg.version.split(".").map(Number);

switch (bumpType) {
  case "major":
    major++; minor = 0; patch = 0;
    break;
  case "minor":
    minor++; patch = 0;
    break;
  case "patch":
  default:
    patch++;
    break;
}

const newVersion = `${major}.${minor}.${patch}`;
pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log(`📦 Neue Version: ${newVersion}`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("📝 Changelog für dieses Release:\n> ", (changelogText) => {
  const logEntry = `📦 v${newVersion} – ${new Date().toLocaleDateString("de-DE")}\n\n- ${changelogText}\n\n`;
  fs.appendFileSync(logPath, logEntry);
  console.log("✅ RELEASE_LOG.md aktualisiert.");

  const buildCommand = `npm run build && npx electron-builder --config electron-builder.yml --publish always`;

  try {
    execSync(buildCommand, { stdio: "inherit", env: { ...process.env } });

    const ghCommand = `gh release edit v${newVersion} --notes "${changelogText}"`;
    execSync(ghCommand, { stdio: "inherit", env: { ...process.env } });
    console.log("🚀 Release Notes auf GitHub aktualisiert!");

    const msiUrl = `https://github.com/JotunJosh/huntmate/releases/download/v${newVersion}/HuntMate-Setup-${newVersion}.msi`;
    console.log("⬇️ Direktlink zur neuen Version:");
    console.log(msiUrl);

  } catch (err) {
    console.error("❌ Build- oder Upload-Fehler:", err);
  }

  rl.close();
});
