@command
Feature: 編輯學習目標
  As a 登入使用者
  I want to 修改已建立的學習目標
  So that 我可以更正或補充目標資訊

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |
    And 系統中有以下學習目標：
      | goal_id | user_id | title     | description  | start_date | end_date   | status      |
      | 1       | 1       | 學 Python | 從基礎開始學 | 2026-05-01 | 2026-08-31 | not_started |

  Rule: 前置 - 使用者只能編輯自己的學習目標
    Example: 編輯他人學習目標失敗
      Given 系統中有以下使用者：
        | user_id | display_name |
        | 2       | 小華         |
      And 系統中有以下學習目標：
        | goal_id | user_id | title   | status      |
        | 2       | 2       | 學 Java | not_started |
      And 以使用者 1 的身份發出請求
      When 使用者編輯學習目標 2：
        | title  |
        | 修改後 |
      Then 操作失敗，violation_type 為 "FORBIDDEN"

  Rule: 前置 - 學習目標必須存在才能編輯
    Example: 編輯不存在的學習目標失敗
      Given 以 $使用者.user_id 身份發出請求
      When 使用者編輯學習目標 999：
        | title  |
        | 修改後 |
      Then 操作失敗，violation_type 為 "NOT_FOUND"

  Rule: 前置 - 編輯後的標題必須非空白
    Example: 將標題改為空白時失敗
      Given 以 $使用者.user_id 身份發出請求
      When 使用者編輯學習目標 1：
        | title | description |
        |       | 任意描述    |
      Then 操作失敗，violation_type 為 "MISSING_REQUIRED_FIELD"

  Rule: 後置 - 編輯成功後目標資訊應立即更新（Partial update 語意）
    Scenario Outline: 成功更新學習目標欄位
      Given 以 $使用者.user_id 身份發出請求
      When 使用者編輯學習目標 1：
        | title   | description   | start_date   | end_date   |
        | <title> | <description> | <start_date> | <end_date> |
      Then 操作成功

      Examples:
        | title    | description  | start_date | end_date   |
        | 學 React | 前端框架學習 | 2026-06-01 | 2026-09-30 |
        | 學 SQL   |              |            |            |

    Example: 只更新 title 時其他欄位保留原值
      Given 以 $使用者.user_id 身份發出請求
      When 使用者編輯學習目標 1：
        | title |
        | 學 Go |
      Then 操作成功
      And 系統中學習目標 1 的資訊應更新為：
        | title | description  | start_date | end_date   |
        | 學 Go | 從基礎開始學 | 2026-05-01 | 2026-08-31 |
