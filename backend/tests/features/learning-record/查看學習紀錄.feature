@query
Feature: 查看學習紀錄
  As a 登入使用者
  I want to 查看某個學習目標下的所有學習紀錄
  So that 我可以回顧學習歷程

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |
    And 系統中有以下學習目標：
      | goal_id | user_id | title     | status      |
      | 1       | 1       | 學 Python | in_progress |
    And 以 $使用者.user_id 身份發出請求

  Rule: 前置 - 使用者只能查看自己目標下的學習紀錄
    Example: 不回傳他人目標下的學習紀錄
      Given 系統中有以下使用者：
        | user_id | display_name |
        | 2       | 小華         |
      And 系統中有以下學習目標：
        | goal_id | user_id | title   | status      |
        | 2       | 2       | 學 Java | in_progress |
      And 系統中有以下學習紀錄：
        | record_id | goal_id | user_id | title       | entry_date |
        | 1         | 1       | 1       | Python 紀錄 | 2026-05-08 |
        | 2         | 2       | 2       | Java 紀錄   | 2026-05-08 |
      When 使用者查詢學習目標 1 下的學習紀錄
      Then 查詢結果應包含以下學習紀錄：
        | record_id | title       |
        | 1         | Python 紀錄 |

  Rule: 後置 - 查詢結果應包含每筆紀錄的標題、圖片（如有）與文字（如有）
    Example: 有紀錄時回傳並依建立時間遞減排序
      Given 系統中有以下學習紀錄：
        | record_id | goal_id | user_id | title  | content   | entry_date |
        | 1         | 1       | 1       | 紀錄一 | 基礎語法  | 2026-05-07 |
        | 2         | 1       | 1       | 紀錄二 | list 操作 | 2026-05-08 |
      When 使用者查詢學習目標 1 下的學習紀錄
      Then 查詢結果應包含以下學習紀錄：
        | record_id | title  | content   | entry_date |
        | 2         | 紀錄二 | list 操作 | 2026-05-08 |
        | 1         | 紀錄一 | 基礎語法  | 2026-05-07 |

    Example: 無紀錄時回傳空列表
      When 使用者查詢學習目標 1 下的學習紀錄
      Then 查詢結果應為空
