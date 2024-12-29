import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

// __dirname代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("http://localhost:5173");
});

// 非 macOS プラットフォームでウインドウが開かれていない時にアプリを終了する
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
