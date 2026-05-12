@command
Feature: 刪除學習目標
  As a 登入使用者
  I want to 刪除學習目標
  So that 我可以移除不再需要的目標

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |
    And 系統中有以下學習目標：
      | goal_id | user_id | title     | status      |
      | 1       | 1       | 學 Python | not_started |
    And 系統中有以下學習紀錄：
      | record_id | goal_id | user_id | title  | entry_date |
      | 1         | 1       | 1       | 紀錄一 | 2026-05-12 |

  Rule: 前置 - 使用者只能刪除自己的學習目標
    Example: 刪除他人學習目標失敗
      Given 系統中有以下使用者：
        | user_id | display_name |
        | 2       | 小華         |
      And 系統中有以下學習目標：
        | goal_id | user_id | title   | status      |
        | 2       | 2       | 學 Java | not_started |
      And 以使用者 1 的身份發出請求
      When 使用者刪除學習目標 2
      Then 操作失敗，violation_type 為 "FORBIDDEN"

  Rule: 前置 - 學習目標必須存在才能刪除
    Example: 刪除不存在的學習目標失敗
      Given 以 $使用者.user_id 身份發出請求
      When 使用者刪除學習目標 999
      Then 操作失敗，violation_type 為 "NOT_FOUND"

  Rule: 前置 - 系統在執行刪除前應顯示確認提示，告知將連帶刪除所有相關學習紀錄
    # 此 Rule 為前端互動行為，由 Frontend E2E（Phase 07）測試覆蓋，後端無對應 Scenario

  Rule: 後置 - 使用者確認後，學習目標及其所有相關學習紀錄一併刪除且不可復原
    Example: 成功刪除學習目標及其所有學習紀錄
      Given 以 $使用者.user_id 身份發出請求
      When 使用者刪除學習目標 1
      Then 操作成功
      And 系統中不應存在 goal_id 為 1 的學習目標
      And 系統中不應存在屬於 goal_id 為 1 的學習紀錄

  Rule: 後置 - 使用者取消確認則不執行刪除，目標與紀錄維持原狀
    # 此 Rule 為前端互動行為，由 Frontend E2E（Phase 07）測試覆蓋，後端無對應 Scenario
