import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import type { AppWorld } from '../support/world'

// JWT for test user (user_id: 4, secret: test-secret-key)
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0fQ.PU8crABgBd2PAImcyjCl1JskzpOMwzUT7p0PyxASkVA'
const BASE_URL = 'http://localhost:3000'

Given('用戶已登入（直接設置 auth-token）', async function (this: AppWorld) {
  await this.context.addCookies([{
    name: 'auth-token',
    value: TEST_TOKEN,
    domain: 'localhost',
    path: '/',
  }])
})

Given('用戶尚未登入', async function (this: AppWorld) {
  await this.context.clearCookies()
})

When('用戶訪問 {string}', async function (this: AppWorld, path: string) {
  const errors: string[] = []
  this.page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  ;(this as any)._consoleErrors = errors
  await this.page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle' })
})

Then('頁面 URL 應為 {string}', async function (this: AppWorld, expectedPath: string) {
  const url = this.page.url()
  expect(url).toContain(expectedPath)
})

Then('頁面應成功載入', async function (this: AppWorld) {
  const status = await this.page.evaluate(() => document.readyState)
  expect(status).toBe('complete')
  const title = await this.page.title()
  expect(title).not.toBe('')
})

Then('頁面不應出現 JavaScript 錯誤', async function (this: AppWorld) {
  const errors: string[] = (this as any)._consoleErrors ?? []
  const critical = errors.filter(e =>
    !e.includes('favicon') &&
    !e.includes('net::ERR') &&
    !e.includes('_next/static')
  )
  expect(critical).toHaveLength(0)
})

Then('頁面應包含新增目標的入口', async function (this: AppWorld) {
  const addButton = this.page.locator('button, [role="button"]').filter({ hasText: /新增|建立|Add|Create/i }).first()
  const count = await addButton.count()
  expect(count).toBeGreaterThan(0)
})
