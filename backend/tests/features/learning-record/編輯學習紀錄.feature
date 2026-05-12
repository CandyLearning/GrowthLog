@command
Feature: 編輯學習紀錄
  As a 登入使用者
  I want to 修改已建立的學習紀錄
  So that 我可以更正或補充學習內容

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |
    And 系統中有以下學習目標：
      | goal_id | user_id | title     | status      |
      | 1       | 1       | 學 Python | in_progress |
    And 系統中有以下學習紀錄：
      | record_id | goal_id | user_id | title  | content  | entry_date |
      | 1         | 1       | 1       | 紀錄一 | 基礎語法 | 2026-05-08 |

  Rule: 前置 - 使用者只能編輯自己的學習紀錄
    Example: 編輯他人學習紀錄失敗
      Given 系統中有以下使用者：
        | user_id | display_name |
        | 2       | 小華         |
      And 系統中有以下學習目標：
        | goal_id | user_id | title | status      |
        | 2       | 2       | 學 Go | in_progress |
      And 系統中有以下學習紀錄：
        | record_id | goal_id | user_id | title   | entry_date |
        | 2         | 2       | 2       | Go 紀錄 | 2026-05-08 |
      And 以使用者 1 的身份發出請求
      When 使用者編輯學習目標 2 的學習紀錄 2：
        | title  |
        | 修改後 |
      Then 操作失敗，violation_type 為 "FORBIDDEN"

  Rule: 前置 - 編輯後的標題必須非空白
    Example: 將標題改為空白時失敗
      Given 以 $使用者.user_id 身份發出請求
      When 使用者編輯學習目標 1 的學習紀錄 1：
        | title | content  |
        |       | 任意內容 |
      Then 操作失敗，violation_type 為 "MISSING_REQUIRED_FIELD"

  Rule: 前置 - 學習紀錄必須存在才能編輯
    Example: 編輯不存在的學習紀錄失敗
      Given 以 $使用者.user_id 身份發出請求
      When 使用者編輯學習目標 1 的學習紀錄 999：
        | title  |
        | 修改後 |
      Then 操作失敗，violation_type 為 "NOT_FOUND"

  Rule: 後置 - 編輯成功後紀錄內容應更新，日期不變
    Example: 成功編輯學習紀錄的標題與內容
      Given 以 $使用者.user_id 身份發出請求
      When 使用者編輯學習目標 1 的學習紀錄 1：
        | title      | content    |
        | 更新的標題 | 更新的內容 |
      Then 操作成功
      And 查詢學習目標 1 的紀錄時，record_id 為 1 的標題應為 "更新的標題"
