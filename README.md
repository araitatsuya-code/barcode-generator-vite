# バーコード生成アプリ

## 概要
このアプリケーションは、複数のバーコードを一括で生成し、PNG形式またはSVG形式で保存できるデスクトップアプリケーションです。

![image](https://github.com/user-attachments/assets/25ecf476-9b7c-407a-bb07-5f11da29c826)

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
