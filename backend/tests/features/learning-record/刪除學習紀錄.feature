@command
Feature: 刪除學習紀錄
  As a 登入使用者
  I want to 刪除學習紀錄
  So that 我可以移除不再需要的紀錄

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |
    And 系統中有以下學習目標：
      | goal_id | user_id | title     | status      |
      | 1       | 1       | 學 Python | in_progress |
    And 系統中有以下學習紀錄：
      | record_id | goal_id | user_id | title  | entry_date |
      | 1         | 1       | 1       | 紀錄一 | 2026-05-08 |

  Rule: 前置 - 使用者只能刪除自己的學習紀錄
    Example: 刪除他人學習紀錄失敗
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
      When 使用者刪除學習目標 2 的學習紀錄 2
      Then 操作失敗，violation_type 為 "FORBIDDEN"

  Rule: 前置 - 學習紀錄必須存在才能刪除
    Example: 刪除不存在的學習紀錄失敗
      Given 以 $使用者.user_id 身份發出請求
      When 使用者刪除學習目標 1 的學習紀錄 999
      Then 操作失敗，violation_type 為 "NOT_FOUND"

  Rule: 後置 - 刪除後紀錄從列表中移除且不可復原
    Example: 成功刪除學習紀錄
      Given 以 $使用者.user_id 身份發出請求
      When 使用者刪除學習目標 1 的學習紀錄 1
      Then 操作成功
      And 查詢學習目標 1 的紀錄時，不應存在 record_id 為 1 的紀錄
