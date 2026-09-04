# qstar · GitHub Pages 部署設定

這一版採用與原本 qZodiac 相同概念的原始碼專案結構：

- 專案根目錄保留 `index.html`、`package.json`、`vite.config.ts`
- React / TypeScript 程式放在 `src/`
- GitHub Actions 工作流程放在 `.github/workflows/deploy.yml`
- GitHub Actions 自動執行 `npm ci` → `npm run build`
- Vite 產生 `dist/`
- `dist/` 由 GitHub Pages 自動發布
- **不使用 `docs/` 資料夾部署**

## GitHub Settings

1. Repository → **Settings** → **Pages**
2. `Build and deployment` 的 **Source** 選擇 **GitHub Actions**
3. 回到 **Actions** 頁面確認 `Deploy qstar to GitHub Pages` 成功完成
4. 正式網址：`https://quincychen0313.github.io/qstar/`

## 重要

`.github` 是隱藏資料夾。若使用 macOS Finder 手動拖曳檔案到 GitHub，請確認 `.github/workflows/deploy.yml` 有一起上傳。
在 Finder 按 `Command + Shift + .` 可顯示隱藏檔案。

不要把 `dist/` 或 `docs/` 當作主要原始碼提交；它們都不是本專案的開發來源。
