# バーコード生成アプリ

## 概要
このアプリケーションは、複数のバーコードを一括で生成し、PNG形式またはSVG形式で保存できるデスクトップアプリケーションです。

![image](https://github.com/user-attachments/assets/5705de17-06fe-4bb2-991c-f3f62cf12f2a)


## 機能
- 複数のバーコード同時生成
- 対応フォーマット：
  - JANコード（EAN-13）
  - ITFコード
  - GS1データバー（CODE128形式で生成）
- PNG/SVG形式での保存対応
- バーコードタイプの一括変更
- 入力値の一括クリア
- ダークモード対応
  - 設定の永続化
  - スムーズな切り替えアニメーション
  - システム全体のテーマ切り替え

## 使用方法
1. アプリを起動
2. バーコード番号を入力
3. バーコードタイプを選択
4. 「バーコードを作成」をクリック
5. 必要に応じてPNGまたはSVG形式で保存

## 詳細仕様
詳細な仕様については[こちら](docs/SPECIFICATIONS.md)をご覧ください。

## ライセンス
MIT License

## 開発環境のセットアップ

### 必要な環境
- Node.js (v18以上)
- npm (v9以上)

### インストール手順
1. `.env.example`を`.env`にコピー
2. `.env`ファイルに必要な情報を設定
   - `APPLE_DEVELOPER_IDENTITY`: Apple Developer証明書ID

### 依存関係のインストール
```bash
npm install
```

### 開発モードでの起動
```bash
# 開発サーバーの起動（ホットリロード対応）
npm run electron-dev
```

### ビルド
```bash
# プロダクションビルド
npm run build:electron
```

### 開発用スクリプト
- `npm run dev`: Viteの開発サーバーを起動
- `npm run electron-dev`: Electron + Viteの開発環境を起動
- `npm run build`: アプリケーションのビルド
- `npm run build:electron`: 配布用パッケージの作成

### 注意事項
- macOSでの開発時は、署名関連の設定が必要です
- 開発モードではDevToolsが自動的に開きます
- `src/main/main.ts`の変更時は、アプリケーションの再起動が必要です
