@query
Feature: 查看電子寵物
  As a 登入使用者
  I want to 查看我的電子寵物狀態
  So that 我可以了解寵物目前的情況

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |
    And 以 $使用者.user_id 身份發出請求

  Rule: 後置 - 每位使用者擁有一個專屬的電子寵物
    Example: 無寵物時查詢失敗（NOT_FOUND）
      When 使用者查詢電子寵物
      Then 操作失敗，violation_type 為 "NOT_FOUND"

  Rule: 後置 - 寵物狀態資訊應在查看時顯示
    Example: 有寵物時回傳正確的寵物狀態
      Given 系統中有以下電子寵物：
        | pet_id | user_id | species  | pet_name | happiness | fullness | level |
        | 1      | 1       | capybara | 小玉     | 80        | 60       | 2     |
      When 使用者查詢電子寵物
      Then 查詢結果應為：
        | species  | pet_name | happiness | fullness | level |
        | capybara | 小玉     | 80        | 60       | 2     |
