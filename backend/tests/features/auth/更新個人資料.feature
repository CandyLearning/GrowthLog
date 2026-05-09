@command
Feature: 更新個人資料
  As a 登入使用者
  I want to 修改我的顯示名稱與大頭照
  So that 我可以使用自訂的個人資訊

  Background:
    Given 系統中有以下使用者：
      | user_id | google_id    | display_name | avatar_url                    |
      | 1       | goog-uid-001 | 小明         | https://lh3.google.com/photo1 |

  Rule: 前置 - 必須登入才能更新個人資料
    Example: 未登入時更新個人資料失敗
      When 使用者更新個人資料：
        | display_name |
        | 新名字       |
      Then 操作失敗，violation_type 為 "UNAUTHORIZED"

  Rule: 後置 - 更新成功後新資料應立即反映在系統中
    Scenario Outline: 更新個人資料成功
      Given 以 $使用者.user_id 身份發出請求
      When 使用者更新個人資料：
        | display_name   | avatar_url   |
        | <display_name> | <avatar_url> |
      Then 操作成功
      And 系統中使用者的個人資料應為：
        | display_name   | avatar_url   |
        | <display_name> | <avatar_url> |

      Examples:
        | display_name | avatar_url                    |
        | 新小明       | https://lh3.google.com/photo1 |
        | 小明         | /uploads/users/1/new.jpg      |
