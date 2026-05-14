# GrowthLog

學習成長追蹤應用程式。記錄學習目標、學習歷程、每日心情、感謝日記，並以電子寵物陪伴成長。

## 功能

- **身份驗證** — Google OAuth 登入
- **學習目標** — 建立、編輯、刪除學習目標，追蹤進度
- **學習紀錄** — 記錄每次學習活動
- **心情記錄** — 每日心情追蹤與標籤
- **感謝日記** — 記錄每日感謝事項
- **電子寵物** — 依學習狀況成長的虛擬寵物

## 技術堆疊

| 層級 | 技術 |
|------|------|
| 前端 | Next.js 14、React 18、TypeScript、Zod、MSW |
| 後端 | Python 3.11+、FastAPI、SQLAlchemy 2.0、Alembic |
| 資料庫 | PostgreSQL 15 |
| 測試 | Behave (BDD E2E)、Cucumber + Playwright (前端) |
| 認證 | JWT + Google OAuth |

## 快速開始

### 前置需求

- Python 3.11+
- Node.js 18+
- Docker（用於 PostgreSQL）

### 1. 啟動資料庫

```bash
cd backend
docker compose up -d
```

### 2. 啟動後端

```bash
cd backend
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### 3. 啟動前端

```bash
cd frontend
npm install
npm run dev
```

前端開發伺服器運行於 `http://localhost:3000`，後端 API 於 `http://localhost:8000`。

## 環境變數

### 後端

| 變數 | 預設值 | 說明 |
|------|--------|------|
| `DATABASE_URL` | `postgresql+psycopg://postgres:postgres@localhost:5432/growthlog_dev` | PostgreSQL 連線字串 |

### 前端（`frontend/.env.development`）

| 變數 | 說明 |
|------|------|
| `NEXT_PUBLIC_API_BASE_URL` | 後端 API 路徑（預設 `/api/v1`） |
| `BACKEND_URL` | 後端伺服器位址（SSR 用，預設 `http://localhost:8000`） |
| `NEXT_PUBLIC_MOCK_API` | 設為 `true` 可使用 MSW 模擬 API |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Client ID |

## 測試

### 後端 BDD 測試

```bash
cd backend
behave
```

### 前端 E2E 測試

```bash
cd frontend
npm test
```

## 專案結構

```
GrowthLog/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI routers
│   │   ├── core/         # 設定、依賴注入
│   │   ├── models/       # SQLAlchemy 模型
│   │   ├── repositories/ # 資料存取層
│   │   ├── schemas/      # Pydantic schemas
│   │   └── services/     # 業務邏輯層
│   ├── alembic/          # 資料庫遷移
│   └── tests/features/   # Behave BDD 測試
├── frontend/
│   └── src/
│       ├── app/          # Next.js App Router 頁面
│       ├── components/   # React 元件
│       ├── lib/          # API client、型別定義
│       └── mocks/        # MSW handlers、fixtures
└── specs/                # 規格文件（activities、features）
```

## API 文件

後端啟動後可於 `http://localhost:8000/docs` 查看互動式 API 文件（Swagger UI）。
