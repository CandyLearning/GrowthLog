@command
Feature: 新增學習紀錄
  As a 登入使用者
  I want to 在學習目標下新增學習紀錄
  So that 我可以記錄每次的學習內容

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |
    And 系統中有以下學習目標：
      | goal_id | user_id | title     | status      |
      | 1       | 1       | 學 Python | in_progress |
    And 以 $使用者.user_id 身份發出請求

  Rule: 前置 - 學習紀錄的標題為必填欄位
    Example: 標題為空時新增失敗
      When 使用者在學習目標 1 下新增學習紀錄：
        | title | content  |
        |       | 任意內容 |
      Then 操作失敗，violation_type 為 "MISSING_REQUIRED_FIELD"

  Rule: 前置 - 學習紀錄必須隸屬於一個已存在的學習目標
    Example: 目標不存在時新增失敗
      When 使用者在學習目標 999 下新增學習紀錄：
        | title    |
        | 今日學習 |
      Then 操作失敗，violation_type 為 "NOT_FOUND"

  Rule: 後置 - 學習紀錄新增成功後應出現在目標的紀錄列表中
    Scenario Outline: 新增學習紀錄成功
      When 使用者在學習目標 1 下新增學習紀錄：
        | title   | content   |
        | <title> | <content> |
      Then 操作成功

      Examples:
        | title           | content                |
        | 今日學習        |                        |
        | 今日學習 Python | 學了 list comprehension |

  Rule: 後置 - 新增學習紀錄時可選擇性上傳附圖
    Example: 附圖上傳後 image_url 應出現在紀錄中
      When 使用者在學習目標 1 下新增學習紀錄（含附圖）：
        | title    | image_filename |
        | 有圖紀錄 | screenshot.png |
      Then 操作成功
      And 查詢學習目標 1 的紀錄時，最新一筆的 image_url 不為空
