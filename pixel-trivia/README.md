# Pixel Trivia - 像素風闖關問答遊戲

這是一個基於 React + Vite 開發，並以 Google Apps Script (GAS) 搭配 Google Sheets 作為後端資料庫的像素風格問答遊戲。

## 系統需求
- Node.js (建議 v18 以上)
- 一個 Google 帳號

## 安裝與啟動步驟

1. **安裝依賴套件**
   在終端機中進入專案目錄，執行：
   ```bash
   npm install
   ```

2. **啟動本機開發伺服器**
   ```bash
   npm run dev
   ```
   啟動後，您可以在瀏覽器開啟 `http://localhost:5173/` 查看遊戲畫面。

3. **環境變數設定**
   請複製或直接修改專案根目錄的 `.env` 檔案：
   ```env
   VITE_GOOGLE_APPS_SCRIPT_URL=這裡請填寫部署後的_GAS_網址
   VITE_PASS_THRESHOLD=6
   VITE_QUESTION_COUNT=10
   ```

---

## Google Sheets 與 Apps Script 設定教學

本遊戲需要依賴 Google Sheets 存放題目與記錄玩家成績。

### 步驟一：建立 Google Sheets
1. 建立一個全新的 Google 試算表。
2. 在左下角建立兩個工作表，名稱**必須**為：
   - `題目`
   - `回答`

### 步驟二：設定資料表欄位 (重要)
- 切換到 **`題目`** 工作表，在第一列 (A1~G1) 依序填入以下標題：
  `題號` | `題目` | `A` | `B` | `C` | `D` | `解答`
- 切換到 **`回答`** 工作表，在第一列 (A1~G1) 依序填入以下標題：
  `ID` | `闖關次數` | `總分` | `最高分` | `第一次通關分數` | `花了幾次通關` | `最近遊玩時間`

### 步驟三：部署 Google Apps Script
1. 在試算表的上方選單點擊 **「擴充功能」 > 「Apps Script」**。
2. 刪除編輯器中的預設程式碼。
3. 打開專案中的 `backend/Code.gs` 檔案，將裡面的程式碼全部複製，並貼上到 Apps Script 編輯器中。
4. 點擊上方的 **「儲存」** (磁碟機圖示)。
5. 點擊右上角的 **「部署」 > 「新增部署作業」**。
6. 左側齒輪圖示選擇 **「網頁應用程式」**。
7. 設定如下：
   - 說明：(可隨意填寫，如 v1)
   - 執行身分：**「我」**
   - 誰可以存取：**「所有人」** (這非常重要，否則前端會遇到 CORS 錯誤)
8. 點擊 **「部署」**。首次部署會要求授權，請點選「核准存取權」> 選擇您的 Google 帳號 > 點選「進階」>「前往（不安全）」>「允許」。
9. 部署完成後，複製畫面上顯示的 **「網頁應用程式網址」**，並貼到專案的 `.env` 檔案中的 `VITE_GOOGLE_APPS_SCRIPT_URL` 裡。

---

## 自動部署到 GitHub Pages

本專案包含 GitHub Actions 設定檔，可以自動將專案建置並部署到 GitHub Pages。

### 設定步驟

1. 確保你的程式碼已經推送到 GitHub 儲存庫的 `main` 分支。
2. 在 GitHub 儲存庫頁面，點擊 **「Settings」** (設定)。
3. 在左側選單找到 **「Secrets and variables」 > 「Actions」**。
4. 點擊 **「New repository secret」** 來新增以下環境變數（請參考 `.env.example` 內容）：
   - `VITE_GOOGLE_APPS_SCRIPT_URL`：(必填) 填入你的 GAS 網頁應用程式網址。
   - `VITE_PASS_THRESHOLD`：(選填) 通關的最低分數門檻（預設為 6）。
   - `VITE_QUESTION_COUNT`：(選填) 總共的題目數量（預設為 10）。
5. 前往 **「Settings」 > 「Pages」**。
6. 在 **「Build and deployment」** 區塊，將 **「Source」** 設定為 **「GitHub Actions」**。
7. 往後只要推送程式碼到 `main` 分支，GitHub Actions 就會自動建置並部署。部署成功後，即可透過 GitHub Pages 網址遊玩遊戲！

*(註：如果你的 GitHub Pages 是在子目錄下運行，例如 `https://<username>.github.io/<repo>/`，請記得在專案的 `vite.config.ts` 中加入 `base: '/<repo>/'` 設定。)*

---

## 測試題庫：生成式 AI 基礎知識

您可以直接將以下表格的內容複製，並貼上到您的 Google Sheets **「題目」** 工作表中（貼在第二列 A2 開始的位置）。

| 題號 | 題目 | A | B | C | D | 解答 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 下列何者是生成式 AI 的主要特徵？ | 只能辨識圖片 | 能夠創造全新內容 | 只能進行數據排序 | 不需要訓練資料 | B |
| 2 | ChatGPT 主要是基於什麼架構開發的？ | CNN | RNN | Transformer | GAN | C |
| 3 | 什麼是 Prompt (提示詞)？ | 電腦的密碼 | 傳給 AI 的指令或問題 | 網頁的原始碼 | 一種程式語言 | B |
| 4 | 下列哪一個不是生成式 AI 圖像工具？ | Midjourney | DALL-E | Stable Diffusion | Excel | D |
| 5 | LLM 的全名是什麼？ | Large Language Model | Local Learning Machine | Light Logic Method | Linear Language Module | A |
| 6 | 下列哪種技術常被用來讓 AI 生成逼真的人臉？ | 決策樹 | GAN (生成對抗網路) | 線性迴歸 | K-Means | B |
| 7 | AI 的「幻覺 (Hallucination)」是指什麼？ | AI 看到了鬼 | AI 生成了看似合理但不正確的資訊 | AI 螢幕閃爍 | AI 自動關機 | B |
| 8 | 在機器學習中，「訓練資料」的作用是什麼？ | 消耗硬碟空間 | 讓模型學習資料中的模式與規律 | 當作防毒軟體 | 取代作業系統 | B |
| 9 | 關於生成式 AI 的版權，目前普遍的共識是什麼？ | AI 生成的內容皆有版權 | 仍存在許多法律與道德爭議 | 只有文字有版權 | AI 創作者需支付版權費給電腦 | B |
| 10 | 以下哪一項最能改善 ChatGPT 的回答品質？ | 提供更具體、帶有上下文的 Prompt | 傳送亂碼 | 重開機 | 一次問 100 個問題 | A |
