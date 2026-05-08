@command
Feature: Google 帳號登入
  As a 訪客
  I want to 使用 Google 帳號登入系統
  So that 我可以存取所有個人功能

  Rule: 後置 - 首次登入時系統建立新帳號並回傳 session token
    Example: 首次使用 Google 帳號登入
      When 使用者以以下 Google 帳號資訊完成 OAuth 授權：
        | google_id       | display_name | avatar_url                    |
        | goog-uid-001    | 小明         | https://lh3.google.com/photo1 |
      Then 操作成功，回傳 session token
      And 系統中應存在以下使用者：
        | google_id    | display_name | avatar_url                    |
        | goog-uid-001 | 小明         | https://lh3.google.com/photo1 |

  Rule: 後置 - 回訪登入時系統識別既有帳號並回傳 session token
    Example: 已有帳號的使用者再次登入
      Given 系統中有以下使用者：
        | user_id | google_id    | display_name | avatar_url                    |
        | 1       | goog-uid-001 | 小明         | https://lh3.google.com/photo1 |
      When 使用者以以下 Google 帳號資訊完成 OAuth 授權：
        | google_id    | display_name | avatar_url                    |
        | goog-uid-001 | 小明         | https://lh3.google.com/photo1 |
      Then 操作成功，回傳 session token
