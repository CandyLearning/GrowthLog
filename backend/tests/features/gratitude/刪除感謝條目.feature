@command
Feature: 刪除感謝日記條目
  As a 登入使用者
  I want to 刪除感謝日記條目
  So that 我可以移除不再需要的紀錄

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |
    And 系統中有以下感謝條目：
      | entry_id | user_id | content  | entry_date |
      | 1        | 1       | 感謝朋友 | 2026-05-08 |

  Rule: 前置 - 使用者只能刪除自己的感謝條目
    Example: 刪除他人感謝條目失敗
      Given 系統中有以下使用者：
        | user_id | display_name |
        | 2       | 小華         |
      And 系統中有以下感謝條目：
        | entry_id | user_id | content  | entry_date |
        | 2        | 2       | 感謝家人 | 2026-05-08 |
      And 以使用者 1 的身份發出請求
      When 使用者刪除感謝條目 2
      Then 操作失敗，violation_type 為 "UNAUTHORIZED"

  Rule: 前置 - 感謝條目必須存在才能刪除
    Example: 刪除不存在的感謝條目失敗
      Given 以 $使用者.user_id 身份發出請求
      When 使用者刪除感謝條目 999
      Then 操作失敗，violation_type 為 "NOT_FOUND"

  Rule: 後置 - 刪除後條目從日記列表中移除且不可復原
    Example: 成功刪除感謝條目
      Given 以 $使用者.user_id 身份發出請求
      When 使用者刪除感謝條目 1
      Then 操作成功
      And 系統中不應存在感謝條目 1
