@command
Feature: 更新學習目標狀態
  As a 登入使用者
  I want to 更新學習目標的狀態
  So that 我可以追蹤目標的進展

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |

  Rule: 前置 - 使用者只能更新自己的學習目標狀態
    Example: 更新他人目標狀態失敗
      Given 系統中有以下使用者：
        | user_id | display_name |
        | 2       | 小華         |
      And 系統中有以下學習目標：
        | goal_id | user_id | title   | status      |
        | 1       | 2       | 學 Java | not_started |
      And 以使用者 1 的身份發出請求
      When 使用者將學習目標 1 的狀態更新為 "in_progress"
      Then 操作失敗，violation_type 為 "UNAUTHORIZED"

  Rule: 前置 - 目標狀態只能在合法狀態之間切換
    Scenario Outline: 非法狀態轉換失敗
      Given 系統中有以下學習目標：
        | goal_id | user_id | title   | status        |
        | 1       | 1       | 學 Java | <from_status> |
      And 以 $使用者.user_id 身份發出請求
      When 使用者將學習目標 1 的狀態更新為 "<to_status>"
      Then 操作失敗，violation_type 為 "INVALID_STATUS_TRANSITION"

      Examples:
        | from_status | to_status   |
        | completed   | in_progress |
        | not_started | completed   |

  Rule: 前置 - 目標必須存在才能更新狀態
    Example: 更新不存在的目標失敗
      And 以 $使用者.user_id 身份發出請求
      When 使用者將學習目標 999 的狀態更新為 "in_progress"
      Then 操作失敗，violation_type 為 "NOT_FOUND"

  Rule: 後置 - 狀態更新成功後應立即反映在目標列表中
    Scenario Outline: 合法的狀態轉換成功
      Given 系統中有以下學習目標：
        | goal_id | user_id | title   | status        |
        | 1       | 1       | 學 Java | <from_status> |
      And 以 $使用者.user_id 身份發出請求
      When 使用者將學習目標 1 的狀態更新為 "<to_status>"
      Then 操作成功
      And 系統中學習目標 1 的狀態應為 "<to_status>"

      Examples:
        | from_status | to_status   |
        | not_started | in_progress |
        | in_progress | completed   |
        | in_progress | abandoned   |
        | abandoned   | in_progress |
