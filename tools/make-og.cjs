// SNS で貼られたときの絵（og.png 1200×630）を作る。今日の問題（答え）は入れず、遊び方の例だけ（架空の精算書の行）。
// 使い方: node tools/make-og.cjs（qa/ の playwright を使う）
const path = require("path");
const { chromium } = require(path.join(__dirname, "..", "qa", "node_modules", "playwright"));
(async () => {
  const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  const line = (t, bad) => `<div style="position:relative;font-size:34px;font-weight:700;padding:14px ${bad ? "190px" : "22px"} 14px 22px;border-radius:12px;background:${bad ? "#fff4f0" : "#fff"};border:${bad ? "5px solid #b23a24" : "3px solid #1d2a3f55"}">${t}${bad ? `<span style="position:absolute;right:18px;top:50%;transform:translateY(-50%) rotate(-8deg);border:4px solid #83261a;color:#83261a;border-radius:8px;padding:0 10px;font-size:30px;font-weight:900;background:#fff">貸した人</span>` : ""}</div>`;
  await p.setContent(`<body style="margin:0;font-family:'Noto Sans CJK JP','IPAPGothic',sans-serif">
  <div style="width:1200px;height:630px;box-sizing:border-box;padding:52px 72px;background:#f3efe4;color:#1d2a3f;display:flex;gap:56px;align-items:center">
    <div style="flex:0 0 430px">
      <div style="font-size:30px;color:#83261a;letter-spacing:.06em">国の資料で学ぶ</div>
      <div style="font-size:76px;font-weight:900;margin-top:8px;line-height:1.15;color:#123554">退去費用<br><span style="color:#b23a24">だれが払う？</span></div>
      <div style="font-size:36px;margin-top:14px">その修理代、<br>本当にあなたが払う？</div>
    </div>
    <div style="flex:1;background:#fffdf7;border:4px solid #1d2a3f;border-radius:8px;overflow:hidden">
      <div style="background:#1d2a3f;color:#fff;font-size:26px;padding:8px 20px">🧾 退去の精算書（架空の部屋）</div>
      <div style="display:flex;flex-direction:column;gap:14px;padding:22px">${line("たばこのヤニのクロス張替え")}${line("家具を置いた床のへこみ", 1)}${line("なくした鍵の交換")}</div>
    </div>
  </div></body>`);
  await p.screenshot({ path: path.join(__dirname, "..", "og.png") });
  await b.close();
})();
