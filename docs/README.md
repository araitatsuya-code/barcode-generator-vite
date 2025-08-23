# Barcode Generator Documentation

バーコード生成デスクトップアプリケーションのドキュメント集です。

## ドキュメント一覧

- **[BUILD.md](./BUILD.md)** - ビルド方法とリリース手順
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - 開発環境セットアップと開発ガイド

## クイックスタート

### 開発を始める
1. 依存関係をインストール: `npm install`
2. 開発サーバー起動: `npm run electron-dev`

### リリースビルド
1. Mac版: `npm run build:electron`
2. Windows版: `npx electron-builder --win`

## 主な機能

- バーコード生成（複数形式対応）
- PDF一括出力
- Excelファイルからの一括生成
- 設定の保存・復元

## サポートプラットフォーム

- macOS (ARM64)
- Windows (ARM64)
- Linux (ARM64)

## 技術スタック

- Electron + React + TypeScript
- Vite + Tailwind CSS
- JsBarcode + jsPDF