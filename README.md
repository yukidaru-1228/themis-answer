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
- `dist/answers/index.html`: 19問の問題一覧・答え・解説
- `dist/answers/answers.css` / `answers.js`: 部屋別の2列表示・インクの解答表示・スクロール・解説ポップアップ
- `dist/answers/assets/`: 各問題と解答図の画像

## ローカルで表示

```sh
python3 -m http.server 8000 --directory dist
```

ブラウザで `http://localhost:8000` を開きます。画像やロゴは同梱しており、ビルド・外部APIキーは不要です。

## 公式資料

https://vercel.com/docs/builds/configure-a-build

## 筆跡素材

添付PDFから透過を保ってWebPへ書き出しています。

- `ink-block.webp`：アセット 1.pdf。解答を描き出すインクに使用。
- `ink-strip.webp`：アセット 2.pdf。現在のページを示すメニューと解答ページへのボタンに使用。
- `ink-backdrop.webp`：アセット 3１.pdf。両ページの背景の筆跡に使用。

## 軽量化

問題一覧はブラウザ標準のスクロールを使用します。問題画像は画面幅に応じて640px・960pxを選び、解説図の元解像度は保持しています。インク描画は必要な問題だけに生成し、描画終了後は静止画像へ置き換えます。和紙のノイズは小さな画像に事前描画し、真相ページの画面更新はフレーム単位にまとめています。証拠写真は表示位置に近づいてから読み込みます。
