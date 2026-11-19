# THEMIS破壊事件 ―― 事件の真相

スクロールで読み進める静的HTMLサイトです。GitHubでソースを管理し、Vercelで公開します。

## Vercelへのデプロイ

VercelでGitHubリポジトリ `yukidaru-1228/themis-answer` をインポートします。

- Project Name: `themis-answer`
- Framework Preset: `Other`
- Root Directory: リポジトリのルート
- Build Command: 空欄（ビルド不要）
- Output Directory: `dist`

ルートの `vercel.json` に設定を保存しています。GitHub連携後は `main` へのプッシュでVercelの本番環境が更新されます。

## 編集対象

- `dist/index.html`: シナリオ本文・画像・赤文字の強調箇所
- `dist/style.css`: 配色・フォント・レイアウト
- `dist/script.js`: スクロールと結末のフェード表示
- `dist/assets/`: 証拠写真・ロゴ・筆跡

## ローカルで表示

```sh
python3 -m http.server 8000 --directory dist
```

ブラウザで `http://localhost:8000` を開きます。画像やロゴは同梱しており、ビルド・外部APIキーは不要です。

## 公式資料

https://vercel.com/docs/builds/configure-a-build
