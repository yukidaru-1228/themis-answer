# THEMIS破壊事件 ―― 事件の真相

静的HTML・CSS・JavaScriptで作成した、スクロールで読み進めるシナリオサイトです。
画像・ロゴは同梱されており、ビルドや外部APIキーは不要です。

## GitHub Pagesへのデプロイ

1. このフォルダーの内容を、公開先GitHubリポジトリのルートに配置します。隠しフォルダー `.github` も含めてください。
2. リポジトリの `Settings > Pages > Build and deployment > Source` を `GitHub Actions` に設定します。
3. `main` ブランチにプッシュします。デフォルトブランチ名が異なる場合は `.github/workflows/deploy-pages.yml` の `branches` を合わせてください。
4. `Actions` で `Deploy THEMIS site to GitHub Pages` の完了を確認します。実行結果の環境URLからサイトを開けます。

以後は `main` へのプッシュで自動更新されます。`workflow_dispatch` による手動実行にも対応しています。

GitHub Freeでは公開リポジトリでGitHub Pagesを使用できます。非公開リポジトリでの利用可否はGitHubの契約プランによります。

## 編集対象

- `dist/index.html`: シナリオ本文・画像・強調する語句
- `dist/style.css`: 配色・フォント・レイアウト
- `dist/script.js`: スクロールと最後のフェード表示
- `dist/assets/`: 画像とロゴ

## ローカルで表示

```sh
python3 -m http.server 8000 --directory dist
```

ブラウザで `http://localhost:8000` を開きます。

## 公式資料

- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
