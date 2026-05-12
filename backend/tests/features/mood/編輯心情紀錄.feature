@command
Feature: 編輯心情紀錄
  As a 登入使用者
  I want to 修改已建立的心情紀錄
  So that 我可以更正心情類型或備注

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |
    And 系統中有以下心情紀錄：
      | entry_id | user_id | mood_type | note       | entry_date |
      | 1        | 1       | happy     | 今天很開心 | 2026-05-08 |

  Rule: 前置 - 使用者只能編輯自己的心情紀錄
    Example: 編輯他人心情紀錄失敗
      Given 系統中有以下使用者：
        | user_id | display_name |
        | 2       | 小華         |
      And 系統中有以下心情紀錄：
        | entry_id | user_id | mood_type | entry_date |
        | 2        | 2       | sad       | 2026-05-08 |
      And 以使用者 1 的身份發出請求
      When 使用者編輯心情紀錄 2：
        | mood_type |
        | happy     |
      Then 操作失敗，violation_type 為 "FORBIDDEN"

  Rule: 前置 - 編輯時 mood_type 為必填且必須是合法選項
    Scenario Outline: mood_type 無效時編輯失敗
      Given 以 $使用者.user_id 身份發出請求
      When 使用者編輯心情紀錄 1：
        | mood_type   |
        | <mood_type> |
      Then 操作失敗，violation_type 為 "<violation>"

      Examples:
        | mood_type | violation                |
        |           | MISSING_REQUIRED_FIELD   |
        | excited   | INVALID_VALUE            |

  Rule: 前置 - 心情紀錄必須存在才能編輯
    Example: 編輯不存在的心情紀錄失敗
      Given 以 $使用者.user_id 身份發出請求
      When 使用者編輯心情紀錄 999：
        | mood_type |
        | happy     |
      Then 操作失敗，violation_type 為 "NOT_FOUND"

  Rule: 後置 - 編輯成功後心情類型與備注應更新，日期不變
    Example: 成功編輯心情紀錄
      Given 以 $使用者.user_id 身份發出請求
      When 使用者編輯心情紀錄 1：
        | mood_type | note       |
        | sad       | 後來變難過 |
      Then 操作成功
      And 系統中心情紀錄 1 的 mood_type 應為 "sad"
