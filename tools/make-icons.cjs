// アプリのアイコン（icon-192.png・icon-512.png）を作る。生成りの紙に、虫めがねと朱の「？」。
// 使い方: node tools/make-icons.cjs（qa/ の playwright を使う）
const path = require("path");
const { chromium } = require(path.join(__dirname, "..", "qa", "node_modules", "playwright"));
(async () => {
  const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  for (const s of [192, 512]) {
    const p = await b.newPage({ viewport: { width: s, height: s } });
    await p.setContent(`<body style="margin:0"><svg width="${s}" height="${s}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#f3efe4"/>
      <rect x="16" y="14" width="52" height="64" rx="4" fill="#fffdf7" stroke="#1d2a3f" stroke-width="2.4"/>
      <rect x="16" y="14" width="52" height="11" rx="3" fill="#1d2a3f"/>
      <line x1="23" y1="35" x2="61" y2="35" stroke="#1d2a3f88" stroke-width="3" stroke-linecap="round"/>
      <line x1="23" y1="46" x2="55" y2="46" stroke="#b23a24" stroke-width="3.4" stroke-linecap="round"/>
      <line x1="23" y1="57" x2="58" y2="57" stroke="#1d2a3f88" stroke-width="3" stroke-linecap="round"/>
      <circle cx="62" cy="58" r="16" fill="#ffffffcc" stroke="#123554" stroke-width="5"/>
      <line x1="73" y1="70" x2="86" y2="84" stroke="#123554" stroke-width="7" stroke-linecap="round"/>
      <text x="62" y="65" font-size="20" text-anchor="middle" fill="#b23a24" font-family="sans-serif" font-weight="900">¥</text></svg></body>`);
    await p.screenshot({ path: path.join(__dirname, "..", `icon-${s}.png`), clip: { x: 0, y: 0, width: s, height: s } });
  }
  await b.close();
})();
