@command
Feature: 改名電子寵物
  As a 登入使用者
  I want to 為電子寵物重新命名
  So that 我可以隨時更改寵物的名字

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |
    And 以 $使用者.user_id 身份發出請求

  Rule: 後置 - 改名後新名稱即時生效
    Example: 改名成功
      Given 系統中有以下電子寵物：
        | pet_id | user_id | species  | pet_name | happiness | fullness | level |
        | 1      | 1       | capybara | 小玉     | 80        | 60       | 1     |
      When 使用者將電子寵物改名為 "新玉"
      Then 操作成功
      And 系統中電子寵物的名稱應為 "新玉"

  Rule: 前置 - 改名時名稱不可為空
    Example: 名稱為空時改名失敗
      Given 系統中有以下電子寵物：
        | pet_id | user_id | species  | pet_name | happiness | fullness | level |
        | 1      | 1       | capybara | 小玉     | 80        | 60       | 1     |
      When 使用者將電子寵物改名為 ""
      Then 操作失敗，violation_type 為 "MISSING_REQUIRED_FIELD"

  Rule: 前置 - 無寵物時無法改名
    Example: 未建立寵物時改名失敗
      When 使用者將電子寵物改名為 "新玉"
      Then 操作失敗，violation_type 為 "NOT_FOUND"
