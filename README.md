# ポートフォリオのJS分離・難読化セット

## フォルダ構成
- `index.html`: HTML。JavaScriptは `js/` の公開ファイルを読み込みます。
- `src/`: 編集用の読みやすいJavaScript。
- `css/style.css`: スタイル。
- `img/`: 既存の画像フォルダをここへ置きます。
- `dist/`: ビルド時に自動生成される公開用ファイル（Git管理しなくてOK）。

## ローカルでビルドする
Node.js 22以降を入れて、プロジェクトのルートで実行します。

```bash
npm install
npm run build
```

生成された `dist/` をローカルサーバーで確認してください。画像など既存の `img/` は、このフォルダ直下に配置してください。

## GitHub Actionsで自動公開する場合
`.github/workflows/deploy.yml` は GitHub Pages の標準デプロイ用です。GitHub リポジトリの Settings → Pages → Build and deployment で Source を **GitHub Actions** にしてください。

**注意:** すでに `willsident.com` へ別方式で公開している場合、このworkflowをそのまま追加すると既存のデプロイ方式と競合する可能性があります。既存workflowを確認してから置き換えてください。独自ドメインを使う場合は Pages の Custom domain 設定も確認してください。

## トレーラーURLの設定
`src/games.js` 内の `GAME_PROJECTS` の各ゲームオブジェクトに、必要な作品だけ次の項目を追加します。

```js
trailer: 'https://www.youtube.com/watch?v=動画ID',
```

`openGameDetail` は `game.trailer` が空でなければ「トレーラー」ボタンを表示します。動画がない作品は `trailer` 行を省略してください。

## セキュリティ上の注意
難読化はコードを読みにくくするだけで、秘密情報を隠す暗号化ではありません。API秘密鍵、管理用トークン、権限のある処理は公開JavaScriptへ置かないでください。Firebaseのアクセス制御はFirestore/Storage Security RulesとApp Check等で設定してください。
