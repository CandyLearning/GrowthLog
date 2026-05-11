@command
Feature: 刪除心情紀錄
  As a 登入使用者
  I want to 刪除心情紀錄
  So that 我可以移除不再需要的紀錄

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |
    And 系統中有以下心情紀錄：
      | entry_id | user_id | mood_type | entry_date |
      | 1        | 1       | happy     | 2026-05-08 |

  Rule: 前置 - 使用者只能刪除自己的心情紀錄
    Example: 刪除他人心情紀錄失敗
      Given 系統中有以下使用者：
        | user_id | display_name |
        | 2       | 小華         |
      And 系統中有以下心情紀錄：
        | entry_id | user_id | mood_type | entry_date |
        | 2        | 2       | sad       | 2026-05-08 |
      And 以使用者 1 的身份發出請求
      When 使用者刪除心情紀錄 2
      Then 操作失敗，violation_type 為 "UNAUTHORIZED"

  Rule: 前置 - 心情紀錄必須存在才能刪除
    Example: 刪除不存在的心情紀錄失敗
      Given 以 $使用者.user_id 身份發出請求
      When 使用者刪除心情紀錄 999
      Then 操作失敗，violation_type 為 "NOT_FOUND"

  Rule: 後置 - 刪除後紀錄從列表中移除且不可復原
    Example: 成功刪除心情紀錄
      Given 以 $使用者.user_id 身份發出請求
      When 使用者刪除心情紀錄 1
      Then 操作成功
      And 系統中不應存在心情紀錄 1
