import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("electron", {
  // 必要な機能をここに追加
});

// グローバルオブジェクトとしてwindowを定義
declare global {
  interface Window {
    electron: {
      // 必要な型定義
    };
  }
}
