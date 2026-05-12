Feature: 前後端整合驗證（Real Backend）

  Background:
    Given 用戶已登入（直接設置 auth-token）

  Scenario: 未登入用戶被導向登入頁
    Given 用戶尚未登入
    When 用戶訪問 "/goals"
    Then 頁面 URL 應為 "/login"

  Scenario: 已登入用戶可查看學習目標列表
    When 用戶訪問 "/goals"
    Then 頁面應成功載入
    And 頁面不應出現 JavaScript 錯誤

  Scenario: 已登入用戶可建立學習目標
    When 用戶訪問 "/goals"
    Then 頁面應成功載入
    And 頁面應包含新增目標的入口

  Scenario: 已登入用戶可查看心情記錄頁面
    When 用戶訪問 "/moods"
    Then 頁面應成功載入
    And 頁面不應出現 JavaScript 錯誤

  Scenario: 已登入用戶可查看感謝日記頁面
    When 用戶訪問 "/gratitude"
    Then 頁面應成功載入
    And 頁面不應出現 JavaScript 錯誤

  Scenario: 已登入用戶可查看寵物頁面
    When 用戶訪問 "/pet"
    Then 頁面應成功載入
    And 頁面不應出現 JavaScript 錯誤
