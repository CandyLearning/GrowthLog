@query
Feature: 查看心情紀錄
  As a 登入使用者
  I want to 查看過去的心情紀錄
  So that 我可以了解自己的情緒趨勢

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |
    And 以 $使用者.user_id 身份發出請求

  Rule: 前置 - 使用者只能查看自己的心情紀錄
    Example: 不回傳其他使用者的心情紀錄
      Given 系統中有以下使用者：
        | user_id | display_name |
        | 2       | 小華         |
      And 系統中有以下心情紀錄：
        | entry_id | user_id | mood_type | entry_date |
        | 1        | 1       | happy     | 2026-05-08 |
        | 2        | 2       | sad       | 2026-05-08 |
      When 使用者查詢心情紀錄
      Then 查詢結果應包含以下心情紀錄：
        | entry_id | mood_type |
        | 1        | happy     |

  Rule: 後置 - 查詢結果應包含心情類型與記錄時間，依記錄時間排序（最新在前）
    Example: 有紀錄時回傳並依 entry_date 遞減排序
      Given 系統中有以下心情紀錄：
        | entry_id | user_id | mood_type | note       | entry_date |
        | 1        | 1       | happy     |            | 2026-05-07 |
        | 2        | 1       | sad       | 今天很難過 | 2026-05-08 |
      When 使用者查詢心情紀錄
      Then 查詢結果應包含以下心情紀錄：
        | entry_id | mood_type | note       | entry_date |
        | 2        | sad       | 今天很難過 | 2026-05-08 |
        | 1        | happy     |            | 2026-05-07 |

    Example: 無紀錄時回傳空列表
      When 使用者查詢心情紀錄
      Then 查詢結果應為空
