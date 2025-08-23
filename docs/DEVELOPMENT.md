# 開発ガイド

## プロジェクト構成

```
barcode-generator-vite/
├── src/                    # ソースコード
│   ├── main/              # Electronメインプロセス
│   ├── renderer/          # Reactレンダラープロセス
│   └── assets/            # アイコンなどのアセット
├── dist/                  # ビルド出力
├── release/               # パッケージ出力
├── build/                 # ビルド設定ファイル
├── scripts/               # ビルドスクリプト
└── docs/                  # ドキュメント
```

## 技術スタック

- **Electron**: デスクトップアプリフレームワーク
- **React**: UIライブラリ
- **TypeScript**: 型安全な開発
- **Vite**: 高速ビルドツール
- **Tailwind CSS**: CSSフレームワーク
- **JsBarcode**: バーコード生成ライブラリ
- **jsPDF**: PDF生成ライブラリ

## 開発環境セットアップ

1. **依存関係のインストール**
```bash
npm install
```

2. **開発サーバー起動**
```bash
npm run electron-dev
```

## 主要なnpmスクリプト

```bash
# 開発
npm run dev              # Vite開発サーバー
npm run electron-dev     # Electron + React開発モード
npm run watch           # TypeScriptウォッチモード

# ビルド
npm run build           # Reactアプリビルド
npm run build:electron  # Electronアプリパッケージ

# その他
npm run lint            # ESLintチェック
npm run preview         # ビルド結果プレビュー
```

## 主要機能の実装場所

### バーコード生成
- `src/renderer/components/BarcodeGenerator.tsx`
- JsBarcodeライブラリを使用

### PDF出力
- `src/renderer/components/PDFExport.tsx`
- jsPDFライブラリを使用

### 設定保存
- `src/main/main.ts`
- electron-storeを使用

### ファイル操作
- `src/renderer/components/FileOperations.tsx`
- Excelファイルのインポートなど

## コーディング規約

- TypeScriptの型定義を必須とする
- ESLintルールに従う
- コンポーネントは関数型で記述
- CSSはTailwindクラスを使用

## デバッグ方法

### レンダラープロセス
- Chrome DevToolsが使用可能
- `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)

### メインプロセス
- VSCodeのデバッガーを使用
- `console.log`でログ出力

## よくある問題と解決方法

### Hot Reloadが効かない
```bash
# 開発サーバーを再起動
npm run electron-dev
```

### TypeScriptエラー
```bash
# 型チェック実行
npx tsc --noEmit
```

### ビルドエラー
```bash
# キャッシュクリア
rm -rf dist node_modules/.cache
npm run build
```