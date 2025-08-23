# ビルドガイド

## 前提条件

### 必要な環境
- Node.js (v18以上)
- npm
- macOS (Mac版ビルド用)
- Apple Developer Account (Mac版署名・公証用)

### 環境変数設定
`.env` ファイルに以下を設定：
```
APPLE_DEVELOPER_IDENTITY="Developer ID Application: [YOUR_NAME] ([YOUR_TEAM_ID])"
AUTHOR_EMAIL=[YOUR_EMAIL]
APPLE_ID=[YOUR_APPLE_ID]
APPLE_TEAM_ID=[YOUR_TEAM_ID]
APPLE_APP_SPECIFIC_PASSWORD=[YOUR_APP_SPECIFIC_PASSWORD]
PUBLISHER_NAME=[YOUR_NAME]
```

## ビルドコマンド

### 開発用
```bash
# 開発サーバー起動
npm run dev

# Electronアプリを開発モードで起動
npm run electron-dev
```

### プロダクション用

#### Mac版（署名・公証付き）
```bash
# Mac版のみビルド
npm run build:electron

# または
source .env && npm run build && electron-builder
```

#### Windows版
```bash
# Windows版のみビルド
npx electron-builder --win

# または
source .env && npm run build && npx electron-builder --win
```

#### Linux版
```bash
# Linux版のみビルド
npx electron-builder --linux
```

#### 全プラットフォーム
```bash
# Mac + Windows + Linux
npx electron-builder --mac --win --linux
```

## 出力ファイル

### Mac版
- `release/Barcode Generator-[version]-arm64.dmg` - 配布用DMGファイル
- `release/mac-arm64/Barcode Generator.app` - アプリケーション本体

### Windows版
- `release/Barcode Generator Setup [version].exe` - インストーラー
- `release/win-arm64-unpacked/` - ポータブル版

### Linux版
- `release/Barcode Generator-[version]-arm64.AppImage` - AppImageファイル

## トラブルシューティング

### 環境変数が読み込めない場合

#### 原因と確認方法
```bash
# .envファイルが存在するか確認
ls -la .env

# 環境変数が正しく設定されているか確認
source .env && echo $APPLE_DEVELOPER_IDENTITY
```

#### 解決方法1: .envファイルの確認
```bash
# .envファイルの内容を確認（個人情報に注意）
cat .env

# 正しい形式で設定されているか確認
# 例: APPLE_TEAM_ID=ABC123XYZ（スペースや引用符に注意）
```

#### 解決方法2: 一時的に直接値を設定
環境変数が読み込まれない場合は、`package.json`の値を直接編集してビルドできます：

1. **一時的に直接値を設定**
```json
// package.json の build.mac セクション
"identity": "Developer ID Application: [YOUR_NAME] ([YOUR_TEAM_ID])",
"extendInfo": {
  "ElectronTeamID": "[YOUR_TEAM_ID]"
}

// build.win セクション  
"publisherName": "[YOUR_NAME]"
```

2. **ビルド実行**
```bash
npm run build:electron
```

3. **⚠️ 重要: ビルド後は必ず元に戻す**
```json
// 個人情報を環境変数参照に戻す
"identity": "${env.APPLE_DEVELOPER_IDENTITY}",
"extendInfo": {
  "ElectronTeamID": "${env.APPLE_TEAM_ID}"
}
"publisherName": "${env.PUBLISHER_NAME}"
```

4. **Gitにコミットする前に確認**
```bash
# 個人情報が含まれていないことを確認
git diff package.json
```

### 署名エラーが発生する場合
1. キーチェーンの証明書を確認
```bash
security find-identity -v -p codesigning
```

2. 証明書の有効期限を確認
3. Apple Developer Accountの状態を確認

### 公証エラーが発生する場合
1. 公証履歴を確認
```bash
xcrun notarytool history --apple-id [APPLE_ID] --team-id [TEAM_ID] --password [PASSWORD]
```

2. エラーログを確認
```bash
xcrun notarytool log [SUBMISSION_ID] --apple-id [APPLE_ID] --team-id [TEAM_ID] --password [PASSWORD]
```

### ビルドキャッシュをクリアする場合
```bash
# リリースフォルダを削除
rm -rf release

# node_modulesキャッシュを削除
rm -rf node_modules/.cache

# 完全クリーンビルド
rm -rf release dist node_modules/.cache
npm run build:electron
```

## バージョン更新

1. `package.json` の `version` フィールドを更新
2. 再ビルド実行

## 注意事項

- Mac版の署名・公証には時間がかかる場合があります（数分〜10分程度）
- Windows版は現在未署名です
- クロスプラットフォームビルドはmacOSから実行することを推奨
- 初回ビルド時は依存関係のダウンロードで時間がかかります

## セキュリティ注意事項

⚠️ **重要**: 個人情報の取り扱いについて

- `.env`ファイルは絶対にGitにコミットしないでください
- `package.json`に直接個人情報を書いた場合は、必ずビルド後に環境変数参照に戻してください
- プッシュ前に `git diff` で個人情報が含まれていないことを確認してください
- Apple ID、パスワード、Team IDなどの機密情報は環境変数で管理してください