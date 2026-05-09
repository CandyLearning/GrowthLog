@command
Feature: 新增感謝日記條目
  As a 登入使用者
  I want to 記錄今天感謝的事情
  So that 我可以培養感恩的習慣

  Background:
    Given 系統中有以下使用者：
      | user_id | display_name |
      | 1       | 小明         |
    And 以 $使用者.user_id 身份發出請求

  Rule: 前置 - 使用者必須提供感謝內容（文字）才能新增條目
    Example: 內容為空時新增失敗
      When 使用者新增感謝條目：
        | content |
        |         |
      Then 操作失敗，violation_type 為 "MISSING_REQUIRED_FIELD"

  Rule: 後置 - 感謝條目應自動記錄當天日期
    Example: 填寫內容後成功新增條目
      When 使用者新增感謝條目：
        | content          |
        | 感謝朋友今天的幫助 |
      Then 操作成功

  Rule: 後置 - 使用者每天可新增多筆感謝條目
    Example: 同一天新增第二筆感謝條目成功
      Given 系統中有以下感謝條目：
        | entry_id | user_id | content  | entry_date |
        | 1        | 1       | 感謝朋友 | 2026-05-08 |
      When 使用者新增感謝條目：
        | content        |
        | 感謝今天的天氣 |
      Then 操作成功

  Rule: 後置 - 感謝條目新增成功後應出現在當天的日記列表中
    Example: 新增後可於日記列表查到
      When 使用者新增感謝條目：
        | content     |
        | 感謝美好的一天 |
      Then 操作成功
      And 查詢結果應包含以下感謝條目：
        | content     |
        | 感謝美好的一天 |
