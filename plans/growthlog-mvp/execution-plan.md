# Execution Plan — growthlog-mvp

> 產出日期：2026-05-08
> 產出 Phase：01 Requirement Analysis

## 概覽

| 類型   | 數量 |
|--------|------|
| Create | 21   |
| Modify | 0    |
| Delete | 0    |

## Phase 02: Entity Modeling

| 操作   | 目標            | 說明                                          |
|--------|-----------------|-----------------------------------------------|
| create | User            | Google OAuth 使用者（名稱、大頭照可自訂）      |
| create | LearningGoal    | 學習目標（描述、開始日期、截止日期、狀態×4）   |
| create | LearningRecord  | 學習紀錄（文字必填、圖片可選，多對一目標）     |
| create | MoodEntry       | 心情記錄（固定6選項 + 自訂標籤、時間戳）       |
| create | GratitudeEntry  | 感謝日記條目（文字、日期，每日可多筆）         |
| create | Pet             | 電子寵物（種類×10固定、名稱、快樂值、飽食度、等級）|

## Phase 03: BDD Analysis

| 操作   | 目標                    | 說明                              |
|--------|-------------------------|-----------------------------------|
| create | auth/ domain            | Google 登入 + 個人資料更新         |
| create | learning-goal/ domain   | 目標 CRUD + 狀態機（4種狀態）      |
| create | learning-record/ domain | 紀錄 CRUD（含圖片上傳）            |
| create | mood/ domain            | 心情記錄 + 查詢                   |
| create | gratitude/ domain       | 感謝日記 CRUD（含編輯）            |
| create | pet/ domain             | 寵物建立 + 查看 + 互動（含連動規則）|

## Phase 04: API Contract

| 操作   | 目標                                  | 說明                         |
|--------|---------------------------------------|------------------------------|
| create | POST /auth/google                     | Google OAuth callback         |
| create | GET/PATCH /users/me                   | 個人資料查看與更新             |
| create | POST/GET /goals                       | 學習目標建立與列表             |
| create | PATCH /goals/{id}/status              | 學習目標狀態更新               |
| create | POST/GET /goals/{id}/records          | 學習紀錄（含圖片上傳）         |
| create | POST/GET /moods                       | 心情記錄                      |
| create | POST/GET /gratitude                   | 感謝日記條目                  |
| create | PATCH /gratitude/{id}                 | 編輯感謝條目                  |
| create | POST /pet                             | 建立寵物（選種類 + 命名）      |
| create | GET /pet                              | 查看寵物狀態                  |
| create | POST /pet/feed                        | 餵食寵物                      |
| create | POST /pet/interact                    | 撫摸互動                      |

## Phase 05-08: Implementation

| 操作               | 目標                        | 說明                             |
|--------------------|-----------------------------|----------------------------------|
| red-green-refactor | auth/*.feature              | Google 登入 + 個人資料 TDD        |
| red-green-refactor | learning-goal/*.feature     | 目標 CRUD + 狀態機 TDD            |
| red-green-refactor | learning-record/*.feature   | 學習紀錄 TDD（含圖片上傳）        |
| red-green-refactor | mood/*.feature              | 心情記錄 TDD                     |
| red-green-refactor | gratitude/*.feature         | 感謝日記 TDD（含編輯）            |
| red-green-refactor | pet/*.feature               | 寵物 TDD（建立、互動、連動規則）  |

## 寵物行為連動規則（Phase 05 實作參考）

| 行為             | 快樂值 | 飽食度 | 等級經驗 |
|------------------|--------|--------|---------|
| 新增學習紀錄      | +10   | —     | +15     |
| 新增感謝日記條目  | +8    | —     | +10     |
| 記錄心情         | +3    | —     | +3      |
| 餵食寵物         | —     | +20   | —       |

## 學習目標狀態機（Phase 02/03 參考）

| 當前狀態   | 可轉換至                        |
|------------|---------------------------------|
| 尚未開始   | 進行中                          |
| 進行中     | 已完成、放棄                    |
| 放棄       | 進行中                          |
| 已完成     | （終態，不可再更改）             |
