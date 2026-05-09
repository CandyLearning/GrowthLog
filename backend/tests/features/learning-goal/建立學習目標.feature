@command
Feature: 建立學習目標
  As a 登入使用者
  I want to 建立一個學習目標
  So that 我可以追蹤自己的學習進度

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |
    And 以 $使用者.user_id 身份發出請求

  Rule: 前置 - 使用者必須提供目標標題才能建立學習目標
    Example: 標題為空時建立失敗
      When 使用者建立學習目標：
        | title | description |
        |       | 任意描述    |
      Then 操作失敗，violation_type 為 "MISSING_REQUIRED_FIELD"

  Rule: 後置 - 學習目標建立成功後初始狀態為「尚未開始」
    Scenario Outline: 建立學習目標成功
      When 使用者建立學習目標：
        | title   | description   | start_date   | end_date   |
        | <title> | <description> | <start_date> | <end_date> |
      Then 操作成功

      Examples:
        | title     | description  | start_date | end_date   |
        | 學 Python |              |            |            |
        | 學 Python | 從基礎開始學 | 2026-05-01 | 2026-08-31 |

    Example: 建立後初始狀態儲存為 not_started
      When 使用者建立學習目標：
        | title     |
        | 學 Python |
      Then 操作成功
      And 系統中學習目標 $學習目標.goal_id 的狀態應為 "not_started"

  Rule: 後置 - 學習目標建立成功後應出現在目標列表中
    Example: 建立後可被查詢到
      When 使用者建立學習目標：
        | title  |
        | 學 SQL |
      Then 操作成功
      And 查詢結果應包含以下學習目標：
        | title  | status      |
        | 學 SQL | not_started |
