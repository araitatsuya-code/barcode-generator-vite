import { app, BrowserWindow } from "electron";
import * as path from "path";

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false  // 開発時のみtrueにすることを推奨
    },
  });

  // 開発モードではローカルサーバーを使用
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    // 本番モードではビルドされたファイルを読み込む
    mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
  }

  // 開発ツールを開く（デバッグ用）
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

// 非 macOS プラットフォームでウインドウが開かれていない時にアプリを終了する
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
