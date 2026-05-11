@command
Feature: 與電子寵物互動
  As a 登入使用者
  I want to 與電子寵物互動
  So that 我可以讓寵物保持良好狀態

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |
    And 以 $使用者.user_id 身份發出請求

  Rule: 後置 - 使用者可以每日餵食寵物，飽食度增加 20
    Example: 餵食成功，飽食度加 20
      Given 系統中有以下電子寵物：
        | pet_id | user_id | species  | pet_name | happiness | fullness | level |
        | 1      | 1       | capybara | 小玉     | 80        | 60       | 1     |
      When 使用者餵食電子寵物
      Then 操作成功
      And 系統中電子寵物的狀態應為：
        | happiness | fullness | level |
        | 80        | 80       | 1     |

    Example: 飽食度超過 100 時正確累積不封頂
      Given 系統中有以下電子寵物：
        | pet_id | user_id | species | pet_name | happiness | fullness | level |
        | 1      | 1       | dog     | 小狗     | 90        | 90       | 1     |
      When 使用者餵食電子寵物
      Then 操作成功
      And 系統中電子寵物的狀態應為：
        | happiness | fullness | level |
        | 90        | 110      | 1     |

  Rule: 後置 - 完成學習紀錄後寵物快樂值增加 10
    Example: 新增學習紀錄觸發寵物快樂值 +10
      Given 系統中有以下學習目標：
        | goal_id | user_id | title     | status      |
        | 1       | 1       | 學 Python | in_progress |
      And 系統中有以下電子寵物：
        | pet_id | user_id | species  | pet_name | happiness | fullness | level |
        | 1      | 1       | capybara | 小玉     | 50        | 60       | 1     |
      When 使用者在學習目標 1 下新增學習紀錄：
        | title    |
        | 今日學習 |
      Then 操作成功
      And 系統中電子寵物的狀態應為：
        | happiness | fullness | level |
        | 60        | 60       | 1     |

  Rule: 後置 - 完成感謝日記後寵物快樂值增加 8
    Example: 新增感謝條目觸發寵物快樂值 +8
      Given 系統中有以下電子寵物：
        | pet_id | user_id | species | pet_name | happiness | fullness | level |
        | 1      | 1       | dog     | 小狗     | 50        | 60       | 1     |
      When 使用者新增感謝條目：
        | content  |
        | 感謝今天 |
      Then 操作成功
      And 系統中電子寵物的狀態應為：
        | happiness | fullness | level |
        | 58        | 60       | 1     |

  Rule: 後置 - 完成心情記錄後寵物快樂值增加 3
    Example: 記錄心情觸發寵物快樂值 +3
      Given 系統中有以下電子寵物：
        | pet_id | user_id | species  | pet_name | happiness | fullness | level |
        | 1      | 1       | capybara | 小玉     | 50        | 60       | 1     |
      When 使用者記錄心情：
        | mood_type |
        | happy     |
      Then 操作成功
      And 系統中電子寵物的狀態應為：
        | happiness | fullness | level |
        | 53        | 60       | 1     |

  Rule: 後置 - 互動或連動後寵物狀態應有所改變並持久保存
    # 持久化由上方各 Scenario 的 aggregate-then 步驟驗證（系統中電子寵物的狀態應為）
