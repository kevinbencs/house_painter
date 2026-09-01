import { test, expect } from '@playwright/test'

test('unauthenticated visitor sees the login form', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByRole('button', { name: 'Belépés' })).toBeVisible()
})

test('a fully authenticated admin is redirected to the dashboard', async ({ page, context }) => {
    await context.addCookies([
        { name: 'longAuthToken', value: '<jwt-signed-with-JWT_SECRET_Long>', url: 'http://localhost:3000' },
    ])
    await page.goto('/login')
    await expect(page).toHaveURL(/\/dashboard/)
})

test('an admin mid-2FA is redirected to /login/2fa', async ({ page, context }) => {
    await context.addCookies([
        { name: '2fa', value: '<jwt-signed-with-JWT_SECRET_TWOFA-for-admin-with-twofa-set>', url: 'http://localhost:3000' },
    ])
    await page.goto('/login')
    await expect(page).toHaveURL(/\/login\/2fa/)
})

test('shows a validation error for an invalid email', async ({ page }) => {
    await page.goto('/login')

    // required + type=email: fill a value the action's zod will reject,
    // but that still lets the form submit (see note on native validation below)
    await page.getByLabel('Email').fill('not-an-email@x')   // adjust so it passes HTML5 but fails zod
    await page.getByLabel('Jelszó').fill('whatever')
    await page.getByRole('button', { name: 'Belépés' }).click()

    await expect(page.getByText(/hib|kötelező|érvénytelen/i)).toBeVisible()
    await expect(page).toHaveURL(/\/login$/)   // stayed on the page
})

test('shows "invalid email or password" for an unknown admin', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill('nobody@example.com')
    await page.getByLabel('Jelszó').fill('somepassword')
    await page.getByRole('button', { name: 'Belépés' }).click()

    await expect(page.getByText('Invalid email or password')).toBeVisible()
})

test('preserves the typed email after a failed attempt', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill('nobody@example.com')
    await page.getByLabel('Jelszó').fill('wrong')
    await page.getByRole('button', { name: 'Belépés' }).click()

    await expect(page.getByText('Invalid email or password')).toBeVisible()
    await expect(page.getByLabel('Email')).toHaveValue('nobody@example.com')  // fieldData round-trip
})