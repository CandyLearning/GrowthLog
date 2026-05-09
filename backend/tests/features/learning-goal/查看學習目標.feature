@query
Feature: 查看學習目標列表
  As a 登入使用者
  I want to 查看我的學習目標
  So that 我可以了解自己的學習計畫

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |
    And 以 $使用者.user_id 身份發出請求

  Rule: 前置 - 使用者只能看到自己建立的學習目標
    Example: 不回傳其他使用者的學習目標
      Given 系統中有以下使用者：
        | user_id | display_name |
        | 2       | 小華         |
      And 系統中有以下學習目標：
        | goal_id | user_id | title     | status      |
        | 1       | 1       | 學 Python | in_progress |
        | 2       | 2       | 學 Java   | not_started |
      When 使用者查詢學習目標列表
      Then 查詢結果應包含以下學習目標：
        | goal_id | title     |
        | 1       | 學 Python |

  Rule: 後置 - 查詢結果應包含目標標題、描述（如有）、日期（如有）與狀態
    Example: 有目標時回傳包含所有欄位的列表
      Given 系統中有以下學習目標：
        | goal_id | user_id | title     | description  | start_date | end_date   | status      |
        | 1       | 1       | 學 Python | 從基礎開始學 | 2026-05-01 | 2026-08-31 | in_progress |
        | 2       | 1       | 學 SQL    |              |            |            | not_started |
      When 使用者查詢學習目標列表
      Then 查詢結果應包含以下學習目標：
        | goal_id | title     | description  | start_date | end_date   | status      |
        | 1       | 學 Python | 從基礎開始學 | 2026-05-01 | 2026-08-31 | in_progress |
        | 2       | 學 SQL    |              |            |            | not_started |

    Example: 無目標時回傳空列表
      When 使用者查詢學習目標列表
      Then 查詢結果應為空

  Rule: 後置 - 查詢結果依截止日期排序（最近截止日期在前）
    Example: 截止日期較近的目標排在前面
      Given 系統中有以下學習目標：
        | goal_id | user_id | title | end_date   | status      |
        | 1       | 1       | 目標A | 2026-12-31 | in_progress |
        | 2       | 1       | 目標B | 2026-06-30 | not_started |
      When 使用者查詢學習目標列表
      Then 查詢結果應包含以下學習目標：
        | goal_id | title |
        | 2       | 目標B |
        | 1       | 目標A |
