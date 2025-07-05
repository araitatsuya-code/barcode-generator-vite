# バーコード生成アプリ

## 概要
このアプリケーションは、複数のバーコードを一括で生成し、PNG・SVG・PDF形式で保存できるデスクトップアプリケーションです。

![image](https://github.com/user-attachments/assets/25ecf476-9b7c-407a-bb07-5f11da29c826)

## ✨ 主な機能

### バーコード生成・管理
- 複数のバーコード同時生成
- 各バーコードに名前・備考を追加可能
- バーコード行の個別削除機能
- 対応フォーマット：
  - JANコード（EAN-13）
  - ITFコード
  - GS1データバー（CODE128形式で生成）

### 出力機能
- **PDF一括出力** - 複数バーコードを1つのPDFにまとめて出力
  - バーコード数に応じたサイズ自動調整
  - 名前・備考もPDFに含めて出力
- **PNG/SVG形式** - 個別ダウンロード対応
  - 名前・備考付きでの画像出力
  - ファイル名に名前を反映

### UI・UX
- バーコードタイプの一括変更
- 入力値の一括クリア
- ダークモード対応
  - 設定の永続化
  - スムーズな切り替えアニメーション
  - システム全体のテーマ切り替え

## 🚀 使用方法
1. アプリを起動
2. バーコード番号を入力
3. 必要に応じて名前・備考を入力
4. バーコードタイプを選択
5. 「バーコードを作成」をクリック
6. 出力方法を選択：
   - **PDF一括出力**: 全バーコードをPDFで出力
   - **PNG/SVG**: 個別にダウンロード

## 詳細仕様
詳細な仕様については[こちら](docs/SPECIFICATIONS.md)をご覧ください。

## ライセンス
MIT License

## 開発環境のセットアップ

### 必要条件
- Node.js (v18以上)
- npm (v9以上)
- macOSでビルドする場合：Apple Developer Programのメンバーシップ

### 初期セットアップ
1. リポジトリをクローン：
   ```bash
   git clone https://github.com/araitatsuya-code/barcode-generator-vite.git
   cd barcode-generator-vite
   ```

2. 依存関係のインストール：
   ```bash
   npm install
   ```

3. 環境変数の設定：
   - `.env.example`を`.env`にコピー：
     ```bash
     cp .env.example .env
     ```
   - `.env`ファイルを編集して、以下の必要な情報を設定：
     ```
     AUTHOR_EMAIL=your.email@example.com
     APPLE_DEVELOPER_IDENTITY=Your Name (TEAM_ID)
     APPLE_ID=your.apple.id@example.com
     APPLE_APP_SPECIFIC_PASSWORD=your-app-specific-password
     APPLE_TEAM_ID=YOUR_TEAM_ID
     ```

### 開発モード
```bash
# Electron + Viteの開発環境を起動（ホットリロード対応）
npm run electron-dev
```

### ビルドと配布

#### 一般的なビルド
```bash
# 基本的なビルド（署名なし）
npm run build:electron
```

#### macOS向け署名と公証
macOSアプリを配布用に署名・公証するには：

1. Apple Developer Programに登録済みであることを確認
2. `.env`ファイルに正しい認証情報を設定していることを確認
3. 以下のコマンドを実行：
   ```bash
   npm run dist
   ```
4. 署名・公証済みのアプリは`release`フォルダに生成されます

#### Windows向けビルド
```bash
# Windowsインストーラーの作成
npm run build:electron
```

### トラブルシューティング

- **署名エラー**: `.env`ファイルの認証情報が正しいか確認してください
- **ビルドエラー**: Node.jsとnpmが最新バージョンか確認してください
- **開発モードでの問題**: `npm cache clean --force`を実行してから再度依存関係をインストールしてみてください

### 開発用スクリプト一覧
- `npm run dev`: Viteの開発サーバーのみ起動
- `npm run build`: フロントエンドのビルドのみ実行
- `npm run electron-dev`: Electron + Viteの開発環境を起動（開発時に使用）
- `npm run build:electron`: 配布用パッケージの作成（署名なし）
- `npm run dist`: 署名と公証を含む完全な配布用パッケージの作成（macOS）

## 📦 ダウンロード

最新版のバーコード生成アプリは以下からダウンロードできます：

### [📥 最新リリース (v1.1.0) をダウンロード](https://github.com/araitatsuya-code/barcode-generator-vite/releases/latest)

#### システム要件
- **macOS**: 10.12以降、Apple Silicon (M1/M2/M3) 対応
- **ファイルサイズ**: 約128MB
- **署名**: Developer ID Application署名済み

## 📝 更新履歴

### v1.1.0 (2025-07-05)
- ✨ **PDF一括出力機能**: 複数バーコードを1つのPDFにまとめて出力
- 🗑️ **削除機能**: 不要なバーコード行を個別に削除可能
- 🏷️ **名前・備考フィールド**: 各バーコードに識別用の名前と備考を追加
- 🖼️ **画像出力改善**: PNG/SVG保存時に名前・備考も含めて出力
- 🔧 **UI改善**: ボタン配置の最適化、フィールドサイズ調整
- 🔧 **SVG出力修正**: 表示エラーの解決
