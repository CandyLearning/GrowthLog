@query
Feature: 查看感謝日記
  As a 登入使用者
  I want to 瀏覽過去的感謝日記
  So that 我可以回顧自己感謝過的事情

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |
    And 以 $使用者.user_id 身份發出請求

  Rule: 前置 - 使用者只能查看自己的感謝日記條目
    Example: 不回傳其他使用者的感謝條目
      Given 系統中有以下使用者：
        | user_id | display_name |
        | 2       | 小華         |
      And 系統中有以下感謝條目：
        | entry_id | user_id | content  | entry_date |
        | 1        | 1       | 感謝朋友 | 2026-05-08 |
        | 2        | 2       | 感謝家人 | 2026-05-08 |
      When 使用者查詢感謝日記
      Then 查詢結果應包含以下感謝條目：
        | entry_id | content  |
        | 1        | 感謝朋友 |

  Rule: 後置 - 查詢結果應依日期分組呈現，最新日期在前
    Example: 有條目時回傳並依 entry_date 遞減排序
      Given 系統中有以下感謝條目：
        | entry_id | user_id | content        | entry_date |
        | 1        | 1       | 感謝昨天的陽光 | 2026-05-07 |
        | 2        | 1       | 感謝今天的朋友 | 2026-05-08 |
        | 3        | 1       | 感謝今天的咖啡 | 2026-05-08 |
      When 使用者查詢感謝日記
      Then 查詢結果應包含以下感謝條目：
        | entry_id | content        | entry_date |
        | 2        | 感謝今天的朋友 | 2026-05-08 |
        | 3        | 感謝今天的咖啡 | 2026-05-08 |
        | 1        | 感謝昨天的陽光 | 2026-05-07 |

    Example: 無條目時回傳空列表
      When 使用者查詢感謝日記
      Then 查詢結果應為空
