@command
Feature: 建立電子寵物
  As a 登入使用者
  I want to 選擇寵物種類並為寵物命名
  So that 我可以開始養育專屬的電子寵物

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |
    And 以 $使用者.user_id 身份發出請求

  Rule: 前置 - 每位使用者只能擁有一隻寵物
    Example: 已有寵物時再次建立失敗
      Given 系統中有以下電子寵物：
        | pet_id | user_id | species  | pet_name | happiness | fullness | level |
        | 1      | 1       | capybara | 小玉     | 100       | 100      | 1     |
      When 使用者建立電子寵物：
        | species | pet_name |
        | cat     | 貓貓     |
      Then 操作失敗，violation_type 為 "ALREADY_EXISTS"

  Rule: 前置 - 使用者必須從 10 個固定種類中選擇一種寵物
    Example: 非法種類時建立失敗
      When 使用者建立電子寵物：
        | species | pet_name |
        | unicorn | 獨角獸   |
      Then 操作失敗，violation_type 為 "INVALID_VALUE"

  Rule: 前置 - 使用者必須為寵物命名才能完成建立
    Example: 寵物名稱為空時建立失敗
      When 使用者建立電子寵物：
        | species | pet_name |
        | dog     |          |
      Then 操作失敗，violation_type 為 "MISSING_REQUIRED_FIELD"

  Rule: 後置 - 寵物建立後初始狀態為：快樂值 100、飽食度 100、等級 1
    Example: 建立成功並驗證初始值
      When 使用者建立電子寵物：
        | species  | pet_name |
        | capybara | 小玉     |
      Then 操作成功
      And 系統中電子寵物的狀態應為：
        | happiness | fullness | level |
        | 100       | 100      | 1     |

  Rule: 後置 - 使用者首次進入寵物功能時須完成寵物建立
    Scenario Outline: 多種合法種類均可成功建立
      When 使用者建立電子寵物：
        | species   | pet_name   |
        | <species> | <pet_name> |
      Then 操作成功

      Examples:
        | species | pet_name |
        | dragon  | 龍龍     |
        | cat     | 咪咪     |
