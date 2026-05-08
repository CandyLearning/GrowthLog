@command
Feature: 記錄心情
  As a 登入使用者
  I want to 記錄當下的心情
  So that 我可以追蹤自己的情緒變化

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |
    And 以 $使用者.user_id 身份發出請求

  Rule: 前置 - 使用者必須從固定選項中選擇一種心情類型才能完成記錄
    Example: mood_type 為空時記錄失敗
      When 使用者記錄心情：
        | mood_type | note     |
        |           | 任意文字 |
      Then 操作失敗，violation_type 為 "MISSING_REQUIRED_FIELD"

    Example: mood_type 不在合法選項內時記錄失敗
      When 使用者記錄心情：
        | mood_type |
        | excited   |
      Then 操作失敗，violation_type 為 "INVALID_VALUE"

  Rule: 後置 - 心情記錄成功後應附上記錄時間
    Scenario Outline: 記錄心情成功（不含標籤）
      When 使用者記錄心情：
        | mood_type   | note   |
        | <mood_type> | <note> |
      Then 操作成功

      Examples:
        | mood_type | note       |
        | happy     |            |
        | sad       | 今天很難過 |

    Example: 記錄心情成功（含自訂標籤）
      Given 系統中有以下心情標籤：
        | tag_id | user_id | tag_name |
        | 1      | 1       | 工作     |
      When 使用者記錄心情：
        | mood_type | tag_ids |
        | good      | 1       |
      Then 操作成功

  Rule: 後置 - 使用者一天可記錄多次心情
    Example: 同一天記錄第二次心情成功
      Given 系統中有以下心情紀錄：
        | entry_id | user_id | mood_type | entry_date |
        | 1        | 1       | happy     | 2026-05-08 |
      When 使用者記錄心情：
        | mood_type |
        | sad       |
      Then 操作成功
