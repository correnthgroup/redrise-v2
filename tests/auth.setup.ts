import { test as setup, expect } from "@playwright/test"

setup("authenticate via current UI", async ({ page }) => {
  const email = process.env.E2E_TEST_EMAIL
  const password = process.env.E2E_TEST_PASSWORD
  if (!email || !password) throw new Error("Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD to a confirmed RedRise test account.")

  await page.goto("/sign-in")
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible()
  await page.getByLabel("Email").fill(email)
  await page.getByLabel("Password").fill(password)
  await page.getByRole("button", { name: "Login", exact: true }).click()
  await expect(page.getByRole("heading", { name: "Workstation", exact: true })).toBeVisible({ timeout: 20000 })
  await page.context().storageState({ path: "tests/.auth/user.json" })
})