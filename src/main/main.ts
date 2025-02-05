import { app, BrowserWindow } from "electron";
import * as path from "path";

let mainWindow: BrowserWindow | null = null;

// アイコンパスの取得
const getIconPath = () => {
  return app.isPackaged
    ? path.join(process.resourcesPath, "icon.png")
    : path.join(__dirname, "../assets/icon.png");
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: getIconPath(),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // 開発モードではローカルサーバーを使用
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    const htmlPath = app.isPackaged
      ? path.join(process.resourcesPath, "renderer", "index.html")
      : path.join(__dirname, "../renderer/index.html");
    mainWindow.loadFile(htmlPath);
  }

  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
}

// Macの場合、Dockアイコンを設定
if (process.platform === "darwin") {
  app.whenReady().then(() => {
    app.dock.setIcon(getIconPath());
  });
}

// アプリケーションの準備が整ってからウィンドウを作成
app.whenReady().then(() => {
  createWindow();

  // macOSでアプリケーションがアクティブになったときにウィンドウを作成
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 非 macOS プラットフォームでウインドウが開かれていない時にアプリを終了する
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
