# Claude×楽天アフィ 自動化スタートガイド（特典ページ）

> 設計の共通原則は `~/.claude/CLAUDE.md` に従う。デザイン基準は `docs/requirements.md`（共通デザイン仕様書）。

## プロジェクト設定

技術スタック: HTML5 / CSS3 / Vanilla JavaScript（ビルドなし）、GitHub Pages。backend・database・環境変数なし（`.env` 系は作らない）。

## 運用ルール

- v2テンプレートの複製。この特典のみ配色を「アイボリー×ブラウン×ベージュ＋くすみピンク」に変更（制作指示書）。テンプレート本体は未変更
- 文章・画像・LINEリンクの単一の源は `js/content.js`。色・フォント・余白の単一の源は `css/style.css` の `:root`。この特典の追加部品は style.css 末尾にまとめる
- 旧テンプレート（`instagram-tokuten-template`・ピンク系）と既存特典は、明示指示がない限り変更しない
- 楽天アフィリエイトの画面名・ルールは公式確認済みの範囲のみ記載（`docs/requirements.md` §4・§5）。**このページにアフィリエイトリンクは置かない**
- 人物写真は本人写真のみ（生成人物を本人として使わない）。写真あり/なしは `hero.avatar` で切替（現在なし）
- CTA: 最後の1か所（指示書のSECTION 9）。最終CTAに教科書バナー＋AI収益化サポート会の案内（目次画像は使わない）。OGP画像は指定がなければ設定しない

## 命名・品質

- ファイル kebab-case / 変数 camelCase / 関数100行・ファイル700行・複雑度10・行長120以下
- ローカル確認: `python3 -m http.server <port>` を1つだけ起動

## ドキュメント管理

許可: `docs/requirements.md` / `docs/SCOPE_PROGRESS.md` / `README.md` / `LICENSE.md`。他は要許諾。

## 品質ゲート

- 第一防壁: ローカル git hook（pre-commit: 秘密情報拒否＋JS構文）
- 最終防壁: GitHub Actions `verify`（JS構文・必須ファイル・index.htmlのリンク切れ）。main保護
- ブランチ: `main`＝公開 / `develop`＝編集
