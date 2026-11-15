# 資料結構複習站（Data Structure Study Guide）

這是一個以 `AGENTS.md` 制定開發規範、以資料驅動產生筆記頁面的靜態網站。主題包含陣列與鏈結串列、堆疊與佇列、二元搜尋樹，以及 BFS/DFS。

## 網頁功能
- 主題卡片與關鍵字搜尋
- 每個主題獨立網址（hash route）
- 核心概念、考試重點、自我測驗與答案展開
- 手機與電腦版響應式排版
- 無套件、無需編譯，可直接發布至 GitHub Pages

## 本機預覽
直接開啟 `index.html` 即可。也可以在專案目錄執行 `python3 -m http.server 8000`，再瀏覽 `http://localhost:8000`。

## 發布至 GitHub Pages
1. 在 GitHub 新建 public repository，例如 `ds-study-guide`。
2. 將**此資料夾內的所有檔案**上傳到 repository 根目錄，包含 `index.html`、`AGENTS.md`、`assets/`、`data/`。
3. 開啟 repository → **Settings** → **Pages**。
4. 於 **Build and deployment** 選 **Deploy from a branch**，設定 `main`、`/(root)`，按 **Save**。
5. 待 GitHub 完成部署後，網站網址通常為 `https://<username>.github.io/ds-study-guide/`。
6. 將 `index.html` 導覽列上的 GitHub 連結改成你自己的 repository URL。

## 新增筆記的範例指令
> 請先閱讀 AGENTS.md，然後依照現有格式新增「Heap 與 Priority Queue」筆記。不要變更頁面結構；新增後請檢查首頁卡片、搜尋與測驗功能。

一般新增主題只需要修改 `data/topics.js`，毋須新增 HTML 或 CSS。請參考 `AGENTS.md` 的 schema 與驗收清單。

## 作業用途
本專案的主要展示不是單一網頁，而是規範文件如何讓 AI 在維持版型、路由和內容結構的前提下，持續擴充不同資料結構章節。


## AI 簡答批改（選配）

每個主題保留「顯示解答」功能，並新增簡答輸入、AI 批改及「複製批改提示詞」。

**不設定後端時**：GitHub Pages 可正常看筆記、填寫答案、顯示標準解答，並可複製結構化提示詞到 ChatGPT 進行真正的 AI 批改；網站內「AI 批改」按鈕會提示尚未啟用服務，不會假裝評分。

**要在網站直接顯示 AI 批改結果時**：需設定 Cloudflare Workers（選配，可能發生 API 使用費）。

1. 申請 Cloudflare Workers，並在本機安裝 Node.js。
2. 打開專案的 `worker/wrangler.toml`，將 `ALLOWED_ORIGIN` 改成你的 GitHub Pages 網站的**來源**（例如 `https://yourname.github.io`，不含 repository 路徑）。如模型不可用，設定 `GEMINI_MODEL` 為帳號可用的模型。
3. 在 Terminal 執行：
   ```sh
   cd worker
   npx wrangler login
   npx wrangler deploy
   npx wrangler secret put GEMINI_API_KEY
   ```
   依提示貼上從 Google AI Studio 取得的 API Key。這個密鑰**不要**貼到 GitHub、`assets/config.js` 或 HTML。
4. 複製部署成功的 `https://...workers.dev` 網址到 `assets/config.js` 的 `window.GRADING_API_ENDPOINT` 中，提交變更到 GitHub。
5. 到公開網頁答題，點選「AI 批改」，確認有分數、優點、改進建議與完整參考答案。

⚠️ Worker 的網址屬於公開 API。`ALLOWED_ORIGIN` 只限制一般瀏覽器的跨來源請求，**不是身分驗證或可靠的防濫用機制**。如果正式公開給多人使用，必須再設使用量上限、限速、濫用防護及費用預算；勿依賴 CORS 避免他人呼叫。示範用的批改不會儲存答案，且會將內容送交 Gemini API。
