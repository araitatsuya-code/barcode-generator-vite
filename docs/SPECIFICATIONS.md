# バーコード生成アプリ 仕様書

## 1. システム概要
### 1.1 目的
複数のバーコードを効率的に生成し、異なる形式で保存できるデスクトップアプリケーションを提供する。

### 1.2 対象ユーザー
- バーコードを扱う業務従事者

## 2. 機能仕様

### 2.1 バーコード生成機能
- 初期状態で5つのバーコード入力フィールドを表示
- 追加ボタンで入力フィールドを無制限に追加可能
- 各フィールドで以下の情報を入力
  - バーコード番号
  - バーコードタイプ（JAN/ITF/GS1データバー）

### 2.2 バーコード表示機能
- 「バーコードを作成」ボタンクリックで一括生成
- 入力値の自動バリデーション
- エラー時はコンソールにエラーメッセージを表示

### 2.3 保存機能
- PNG形式での保存
  - 解像度：標準
  - ファイル名：barcode-{番号}.png
- SVG形式での保存
  - ベクター形式
  - ファイル名：barcode-{番号}.svg

### 2.4 一括操作機能
- バーコードタイプの一括変更
- 入力値の一括クリア

### 2.5 バーコードセット管理機能
- バーコードセットの保存
  - セット名をつけて現在の入力内容を保存
  - LocalStorageに保存データを永続化
- バーコードセットのエクスポート/インポート
  - JSONファイル形式でのエクスポート
  - エクスポートしたファイルのインポート
  - 既存のセットと結合して保存
- バーコードセットの削除
  - 各セットに削除ボタンを表示
  - 確認ダイアログ表示後に削除
  - LocalStorageから完全に削除
- バーコードセットの呼び出し
  - サイドバーに保存済みセット一覧を表示
  - クリックで即座に呼び出し可能
- 保存データの表示
  - セット名
  - 作成日時

## 3. 技術仕様

### 3.1 入力値制限
- スペース、ハイフン、全角スペースは自動除去
- バーコードタイプごとの桁数制限
  - JANコード：13桁
  - ITFコード：偶数桁
  - GS1データバー：13桁

### 3.2 UI仕様
- レスポンシブデザイン対応
- Tailwind CSSによるスタイリング
- アイコン表示：react-iconsを使用

### 3.3 エラーハンドリング
- 不正な入力値の場合はアラート表示
- バーコード生成失敗時はエラーメッセージを表示

## 4. 動作環境
- OS：Windows/Mac/Linux
- 推奨解像度：1280x720以上