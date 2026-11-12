# AGENTS.md

退去費用だれが払う？：賃貸の部屋を出るときの精算書（架空）の4つの行から、本当は貸した人が払う行を見きわめる、1日5問の学習ゲーム。`index.html` と `data.js`（きまりの種類と問題の作り方）を GitHub Pages で公開する。

## 準備（最初に一度）

```bash
bash scripts/setup.sh   # Node.js（版は .nvmrc）を確かめ、検査の依存とブラウザを入れる。何度実行してもよい
```

## push する前の確認

```bash
node qa/run.mjs   # 問題（17種類×3000問：答えは1つ・借りた人の行と答えの行の目印・年数の計算・出典）・今日の5問と上級（3年分）・とことんの並び（300回）・通しで遊ぶ・続きから・あとから・言い方・スマホ幅・PWA・引き継ぎ・見やすさ（CI の QA と同じ）
```

## このリポジトリの決まり

- 中身（だれが払うか・なぜか）は、`data.js` の `SRC` にある国土交通省「原状回復をめぐるトラブルとガイドライン（再改訂版）」で確かめたことだけ（要点は共有フォルダ `games/taikyo-research.md`）。新しい種類を足すときもガイドラインの本文（別表1・別表2・経過年数・特約）を読み、`src` に出典を付ける。
- 法律の相談にしない：「必ず払わなくてよい」と言い切らない。「このゲームについて」と README に、法律の相談ではないこと・実際は契約や部屋の様子で変わること・相談先（188）を置く（QA が見る）。
- 部屋・人・会社・精算書はすべて架空。実在の物件名・会社名・ロゴは使わない。画面に「架空」と出す。
- 問題は `data.js` の `KINDS`（やさしい4・ふつう7・むずかしい6）が種から作る。`bill` は貸した人が払う行1つ＋借りた人が払う行3つ（`NEUTRAL`、別表1の B・A(+B)）、`act` は場面と正しいもの1つ＋まちがい3つ。借りた人の行には QA の `FAULT`（借りた人のせいの言葉）を必ず入れ、答えの行には入れない。種類を足したら QA の数（17・4,7,6）も直す。年数で減る問題（`DEP`）は QA が「6年で1円まで、まっすぐ減る」計算と比べる。
- 今日の5問（やさしい2・ふつう2・むずかしい1、種類は重ねない）・上級（むずかしい3、今日のむずかしいと別）は日本時間の日付の種で決まり、だれでも同じ。`Math.random()` は練習・とことんの種だけ（QA が数を見る）。乱数は `sort` の比較の中で引かない。`KINDS`・`ROOMS`・`NEUTRAL`・言い回しの並びは最後に足すだけ（並べ替え・削除で過去の日の問題が変わる。QA の `PIN` が第1回の1問目を見る）。`data.js` を変える PR は自動ではマージされない（`hold_paths`）。
- ★はまちがい＋ヒントの数（0で★3・1で★2・2以上で★1）。ヒントは1回目が「見るところ」（答えは言わない）、2回目が選び肢を2つにしぼる。上級はヒントなし。正解したら必ず「なぜ」と出典を出す。時間制限なし。
- 今日の5問・上級は1日1回で、途中で閉じても続きから。途中経過はモードごと（`runs.d`・`runs.h`・`runs.p`・`runs.e`・`runs["a:日付"]`）。答える前に保存した進み具合が画面と同じ問題か確かめる（`same`）。途中の保存（`keep`）は別のタブで使ったヒント・まちがいを減らさない。`load` は合わせる前に両方を `fresh()` で補う（shared-workflows `incidents/2026-11-04-daily-game-save-gaps.md`）。
- 好きなだけ遊べる：チケット・ライフ・回数制限・🔒で開くモードを入れない（shared-workflows `routines/game-dev.md` F1〜F7。QA が見る）。とことん（`runs.e`）はまちがえてもヒントを使っても続き、「ここで降りる」で終わる。並び（`endlessList`：やさしい6→ふつう14→ふつう・むずかしい40）は1回の中で同じ問題（`keyOf`）と同じ種類の連続を出さず、残り5問で `moreList` が40問足す。自己ベスト `ebest` は一度で見きわめた数。今日の記録・連続・Ko-fi・シェアには数えない（きまり帳には載る）。
- 1問を深くする（shared-workflows `routines/game-dev.md`「1問を深くする」）：`depth.js` と `qa/depth-check.mjs` は shared-workflows `template/` の写しで、ここでは直さない。答える前に「🎯 自信あり？」を押せる（この回の数は `runs.*.ds`）。精算書の問題（`bill`）は、見つけたら2段目「なぜ貸した人？」を `data.js` の `GROUPS` の3つ（古くなっただけ／ふつうに住んだ跡／次の人のための用意）から選ぶ。種類と分け方の対応は `GRP`（精算書の種類を足したら `GRP` にも足す。QA が見る）。2段目のまちがい・ヒントも★に数え、2段目のヒントはちがう分け方を1つ消す。まちがい・ヒントがあった問題は `Depth.mark` で復習へ入り、1→3→7日後にホームの「復習」（`runs.r`）に戻る。復習は今日の記録・連続・Ko-fi・シェアに数えない。
- 実績（`ACH` 13個）は記録から毎回数え、新しく残すのは知らせ終えた印 `ach` だけ。取りこぼした日（きのう〜7日前、`EPOCH` より後）はカレンダーからあとから遊べる（記録は `adays`。連続・今日の記録・Ko-fi・シェアには数えない）。
- 共有は遊ぶ人が押したときに開くリンク（X・LINE・Web Share・コピー）だけ。シェアの文に問題・答え・部屋の名前を出さない。
- 感想は「感想を送る」から GitHub の Issue フォーム（`.github/ISSUE_TEMPLATE/feedback.yml`、name は「感想フォーム」）を開くだけ。名前・メールは聞かない。
- 応援は Ko-fi（https://ko-fi.com/satouaaaaa）へのただのリンクだけ。今日の5問・上級を初めて全部まちがいなしで終えたときだけ、結果の画面の下に1行。遊ぶのは無料のまま。
- 外へ通信しない。外から読むのは Google Fonts の文字だけ（CSP の `connect-src 'self'` を広げない）。出典は押したときに開くただのリンク。記録は遊ぶ人のブラウザ（localStorage）だけ。
- 見やすさ：`</head>` の前の見やすさの設定（`<!-- a11y:begin -->`〜`end`）は shared-workflows `template/a11y/a11y.html` の写し、`qa/a11y.mjs` は `template/qa/a11y.mjs` の写しで、ここでは直さない。色だけで分けない（貸した人の行は「貸した人」の判、場面の正解は「✓ 正解」、まちがいは「✕ ちがう」と破線、取れなかった星は ☆）。文字の大きさは3段（`tkh-fs`）。
- 引き継ぎ：`transfer.js` と `qa/transfer-check.mjs` は shared-workflows `template/` の写しで、ここでは直さない。`data-keys` は `tkh-v1,tkh-fs,tkh-depth`。記録の形を変えたら QA の `sample` も合わせる。
- 写し元：画面と QA は健康情報みぬき（kenko-minuki）の形から作った。QA の「写し元のゲームの言葉が残っていない」に写し元の言葉を登録してある。
- 少し遅れて動く処理（setTimeout）は、画面が替わっていたら何もしない。一行の式の途中にコメント `//` を足さない。
- 機能を足す・直すたびに `qa/run.mjs` に検査を足す。乱数で組む部分は何百〜何千回も作って確かめる（shared-workflows `incidents/2026-10-31-roppo-empty-village.md`）。
- PWA（`manifest.webmanifest`・`sw.js`・`icon-*.png`）：画面のファイルを足したら `sw.js` の `SHELL` にも足し、中身を大きく変えたら `CACHE` の版を上げる。アイコンは `node tools/make-icons.cjs`、SNS 用の絵 `og.png` は `node tools/make-og.cjs`（今日の問題を入れない）。
- 公開リポジトリなので、個人情報・鍵を入れない。

## 公開

- GitHub Pages は `main` のルート（`/`）を公開する。PR の QA と Secret scan が ✅ になると `automerge.yml` が自動でマージする。止めたいときは下書きにするか、ラベル「自動マージしない」を付ける。
- `sw.js`・`manifest.webmanifest`・`data.js` を変える PR は自動ではマージされない（`hold_paths`）。CodeRabbit のレビューを待ち、手でマージする直前に今の head へのレビューを読み直す（shared-workflows `incidents/2026-11-01-roppo-merged-before-review.md`）。CodeRabbit は PR に `@coderabbitai review` とコメントして頼む。

## 共通のきまり

- PR の作り方・マージの仕方は satou-aaaaa/shared-workflows の `routines/pr.md`、全体のきまりは `routines/common.md` に従う。
- CI の部品は shared-workflows の共通部品を呼ぶ。リポジトリ側の .github/workflows には呼び出しと設定値だけを書く。
- Claude 以外の AI・人が作業するときは、shared-workflows の `routines/tool-map.md` と `routines/without-claude.md` を読む。
