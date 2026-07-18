import { expect, test } from "@playwright/test"

test("Space -> Process -> Canvas -> failed Run -> Actions -> Retry", async ({ page }) => {
  const suffix = Date.now()
  const spaceName = "E2E Space " + suffix
  const processName = "E2E Process " + suffix

  await page.goto("/my-business/workstation/spaces")
  await expect(page.getByRole("heading", { name: "Spaces", exact: true })).toBeVisible()

  await page.getByRole("button", { name: "New Workspace" }).click()
  await page.getByLabel("Name").fill(spaceName)
  await page.getByLabel("Description").fill("End to end Workstation validation")
  await page.getByRole("button", { name: "Create", exact: true }).click()
  await expect(page.getByText(spaceName, { exact: true })).toBeVisible()

  await page.getByRole("link", { name: "Process", exact: true }).click()
  await page.getByRole("button", { name: "New Process" }).click()
  await page.getByPlaceholder("Invoice Exception Review").fill(processName)
  await page.getByPlaceholder("Describe what this Process coordinates.").fill("Deterministic failed execution and retry")
  await page.getByRole("button", { name: "Create", exact: true }).click()
  await expect(page.getByText(processName, { exact: true })).toBeVisible()

  await page.getByLabel("Open actions for " + processName).click()
  await page.getByRole("menuitem", { name: "Open canvas" }).click()
  await expect(page.getByRole("heading", { name: processName + " Canvas" })).toBeVisible()

  await page.getByText("Initial llm node", { exact: true }).click()
  await page.getByRole("button", { name: "Edit", exact: true }).click()
  const dialog = page.getByRole("dialog")
  await dialog.locator("textarea").nth(3).fill('{"model":"default","simulateFailure":true}')
  await dialog.getByRole("button", { name: "Save changes" }).click()

  await page.getByRole("button", { name: "Run", exact: true }).click()
  await page.getByRole("link", { name: "Actions", exact: true }).click()
  await expect(page.getByText(processName).first()).toBeVisible()
  await expect(page.getByText("failed", { exact: true }).first()).toBeVisible({ timeout: 10000 })

  await page.getByText("failed", { exact: true }).first().click()
  await expect(page.getByRole("button", { name: "Retry" })).toBeVisible()
  await page.getByRole("button", { name: "Retry" }).click()
  await expect(page.getByText("completed", { exact: true }).first()).toBeVisible({ timeout: 10000 })
})