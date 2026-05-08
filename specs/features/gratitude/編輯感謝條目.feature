@command
Feature: 編輯感謝日記條目
  As a 登入使用者
  I want to 修改過去的感謝條目
  So that 我可以更正或補充感謝的內容

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |
    And 系統中有以下感謝條目：
      | entry_id | user_id | content  | entry_date |
      | 1        | 1       | 感謝朋友 | 2026-05-08 |

  Rule: 前置 - 使用者只能編輯自己的感謝條目
    Example: 編輯他人感謝條目失敗
      Given 系統中有以下使用者：
        | user_id | display_name |
        | 2       | 小華         |
      And 系統中有以下感謝條目：
        | entry_id | user_id | content  | entry_date |
        | 2        | 2       | 感謝家人 | 2026-05-08 |
      And 以使用者 1 的身份發出請求
      When 使用者編輯感謝條目 2：
        | content    |
        | 修改的內容 |
      Then 操作失敗，violation_type 為 "UNAUTHORIZED"

  Rule: 前置 - 編輯後的內容必須非空白
    Example: 將感謝條目內容改為空白時失敗
      Given 以 $使用者.user_id 身份發出請求
      When 使用者編輯感謝條目 1：
        | content |
        |         |
      Then 操作失敗，violation_type 為 "MISSING_REQUIRED_FIELD"

  Rule: 前置 - 感謝條目必須存在才能編輯
    Example: 編輯不存在的感謝條目失敗
      Given 以 $使用者.user_id 身份發出請求
      When 使用者編輯感謝條目 999：
        | content    |
        | 修改的內容 |
      Then 操作失敗，violation_type 為 "NOT_FOUND"

  Rule: 後置 - 編輯成功後條目內容應更新，日期不變
    Example: 成功編輯感謝條目的內容
      Given 以 $使用者.user_id 身份發出請求
      When 使用者編輯感謝條目 1：
        | content        |
        | 感謝朋友的協助 |
      Then 操作成功
      And 系統中感謝條目 1 的內容應為 "感謝朋友的協助"
