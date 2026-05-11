# GrowthLog 開發注意事項

## 環境切換

### Mock → 真實後端

切換 `.env.development` 的 `NEXT_PUBLIC_MOCK_API` 後，**必須先清除瀏覽器的 `auth-token` cookie**，否則 mock 產生的假 token 會帶進真實後端，導致驗證異常（例如登入後仍被導向 /goals，即使沒有寵物）。

清除方式（任選一）：
- 瀏覽器 DevTools → Application → Cookies → 刪除 `auth-token`
- 或在 console 執行：`document.cookie = 'auth-token=; path=/; max-age=0'`

### 啟動服務

```bash
# Postgres
cd backend && docker-compose up -d

# Backend (FastAPI)
cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# Frontend (固定 port 3000)
cd frontend && npm run dev
```

健康檢查：`curl http://localhost:8000/health`

## Frontend Port

`package.json` 已設定 `next dev --port 3000`，若 3000 被占用會直接報錯（不會自動飄到 3001）。
