import { test, expect } from '@playwright/test'

test('submitting the contact form shows a success message', async ({ page }) => {
  await page.goto('/kapcsolat')

  await page.getByLabel('Név').fill('Teszt Elek')        
  await page.getByLabel('Email').fill('teszt@example.com')
  await page.getByLabel('Üzenet').fill('Ez egy teszt üzenet.')
  await page.getByLabel('Felhasználási feltételek elfogadása').click()

  await page.getByRole('button', { name: /küld/i }).click()

  await expect(page.getByText(/Üzenet elküldve|sikeres|elküldve|köszönjük/i)).toBeVisible()
})

/*test('an empty contact form shows validation errors', async ({ page }) => {
  await page.goto('/kapcsolat')
  await page.getByRole('button', { name: /küldés/i }).click()

  await expect(page.getByText(/kötelező|hib/i)).toBeVisible()
  // and confirm it did NOT navigate away / show success
  await expect(page.getByText(/sikeres/i)).not.toBeVisible()
})*/