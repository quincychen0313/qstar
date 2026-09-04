qstar 游標更新 v4
=================

目前 GitHub Pages 仍由 main /docs 發布，所以本包同時保留：
1. React/Vite 原始碼結構
2. 已可直接生效的 docs 部署內容
3. .github/workflows/deploy.yml（之後可改成 GitHub Actions）

最快生效方式：
- 解壓本 ZIP。
- 在 GitHub qstar repository 點 Add file > Upload files。
- 將解壓後所有內容拖入，上傳並覆蓋同名檔案。
- 特別確認 docs 裡有：
  qstar-cursor-v4.css
  qstar-cursor-v4.js
  index.html
- Commit changes。

由於檔名升級為 v4，Safari 不會再沿用舊游標快取。
GitHub Pages 若仍設定 main /docs，不用改設定就會直接顯示新版游標。
