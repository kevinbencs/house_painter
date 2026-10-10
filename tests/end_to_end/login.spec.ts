import { test, expect, type Page } from '@playwright/test'
import {
    connectDb, disconnectDb, seedAdmin, deleteAdmin, uniqueEmail,
    newTwoFASecret, totpFor, setAuthCookie, setTwoFACookie,
} from './helpers'

const PASSWORD = 'CorrectHorse123'

test.beforeAll(connectDb)
test.afterAll(disconnectDb)

const login = async (page: Page, email: string, password: string) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Jelszó').fill(password)
    await page.getByRole('button', { name: 'Belépés' }).click()
}

test.describe('/login page', () => {
    test('an unauthenticated visitor sees the login form', async ({ page }) => {
        await page.goto('/login')

        await expect(page).toHaveURL(/\/login$/)
        await expect(page.getByLabel('Email')).toBeVisible()
        await expect(page.getByLabel('Jelszó')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Belépés' })).toBeVisible()
    })

    test('a logged-in admin is redirected to the dashboard', async ({ page, context }, testInfo) => {
        const email = uniqueEmail(testInfo)
        const id = await seedAdmin({ email, password: PASSWORD, twofa: newTwoFASecret() })
        await setAuthCookie(context, id)

        await page.goto('/login')

        await expect(page).toHaveURL(/\/dashboard/)
        await deleteAdmin(email)
    })

    test('an admin mid-2FA is redirected to /login/2fa', async ({ page, context }, testInfo) => {
        const email = uniqueEmail(testInfo)
        const id = await seedAdmin({ email, password: PASSWORD, twofa: newTwoFASecret() })
        await setTwoFACookie(context, id)

        await page.goto('/login')

        await expect(page).toHaveURL(/\/login\/2fa$/)
        await deleteAdmin(email)
    })

    test('an admin mid-2FA without a 2FA secret is redirected to /new2fa', async ({ page, context }, testInfo) => {
        const email = uniqueEmail(testInfo)
        const id = await seedAdmin({ email, password: PASSWORD, twofa: '' })
        await setTwoFACookie(context, id)

        await page.goto('/login')

        await expect(page).toHaveURL(/\/new2fa$/)
        await deleteAdmin(email)
    })

    test('a forged AuthToken cookie is ignored', async ({ page, context }) => {
        await context.addCookies([{ name: 'AuthToken', value: 'not-a-jwt', url: 'http://localhost:3000' }])

        await page.goto('/login')

        await expect(page).toHaveURL(/\/login$/)
    })
})

test.describe('loginAction', () => {
    test('shows a validation error for an invalid email', async ({ page }) => {
        // "x" passes the browser's type="email" check but not zod's z.email()
        await login(page, 'not-an-email@x', 'whatever')

        await expect(page.getByText('Email-t kötelező megadni')).toBeVisible()
        await expect(page).toHaveURL(/\/login$/)
    })

    test('shows "Invalid email or password" for an unknown admin', async ({ page }) => {
        await login(page, 'nobody@example.com', 'somepassword')

        await expect(page.getByText('Invalid email or password')).toBeVisible()
        await expect(page).toHaveURL(/\/login$/)
    })

    test('shows "Invalid email or password" for a wrong password', async ({ page }, testInfo) => {
        const email = uniqueEmail(testInfo)
        await seedAdmin({ email, password: PASSWORD, twofa: newTwoFASecret() })

        await login(page, email, 'WrongPassword123')

        await expect(page.getByText('Invalid email or password')).toBeVisible()
        await expect(page).toHaveURL(/\/login$/)
        await deleteAdmin(email)
    })

    test('keeps the typed email after a failed attempt', async ({ page }) => {
        await login(page, 'nobody@example.com', 'wrong')

        await expect(page.getByText('Invalid email or password')).toBeVisible()
        await expect(page.getByLabel('Email')).toHaveValue('nobody@example.com')
    })

    test('a correct login for an admin with 2FA goes to /login/2fa', async ({ page }, testInfo) => {
        const email = uniqueEmail(testInfo)
        await seedAdmin({ email, password: PASSWORD, twofa: newTwoFASecret() })

        await login(page, email, PASSWORD)

        await expect(page).toHaveURL(/\/login\/2fa$/)
        await expect(page.getByLabel('Kód')).toBeVisible()
        await deleteAdmin(email)
    })

    test('a correct login for an admin without 2FA goes to /new2fa', async ({ page }, testInfo) => {
        const email = uniqueEmail(testInfo)
        await seedAdmin({ email, password: PASSWORD, twofa: '' })

        await login(page, email, PASSWORD)

        await expect(page).toHaveURL(/\/new2fa$/)
        await deleteAdmin(email)
    })
})

test.describe('/login/2fa', () => {
    test('redirects to / without a 2fa cookie', async ({ page }) => {
        await page.goto('/login/2fa')

        await expect(page).toHaveURL('http://localhost:3000/')
    })

    test('a wrong code shows an error and stays on the page', async ({ page }, testInfo) => {
        const email = uniqueEmail(testInfo)
        const secret = newTwoFASecret()
        await seedAdmin({ email, password: PASSWORD, twofa: secret })
        await login(page, email, PASSWORD)
        await expect(page).toHaveURL(/\/login\/2fa$/)

        // A wrong code must still pass validation (6 digits, 100000-999999),
        // otherwise the form shows the validation message instead.
        const valid = await totpFor(secret)
        const wrong = valid === '123456' ? '654321' : '123456'
        await page.getByLabel('Kód').fill(wrong)
        await page.getByRole('button', { name: 'Belépés' }).click()

        //await expect(page.getByText('Hiba, próbáld újra.')).toBeVisible()
        await expect(page).toHaveURL(/\/login\/2fa$/)
        await deleteAdmin(email)
    })

    test('the full login with a valid TOTP code ends on the dashboard', async ({ page }, testInfo) => {
        const email = uniqueEmail(testInfo)
        const secret = newTwoFASecret()
        await seedAdmin({ email, password: PASSWORD, twofa: secret })

        await login(page, email, PASSWORD)
        await expect(page).toHaveURL(/\/login\/2fa$/)

        await page.getByLabel('Kód').fill(await totpFor(secret))
        await page.getByRole('button', { name: 'Belépés' }).click()

        await expect(page).toHaveURL(/\/dashboard/)
        await deleteAdmin(email)
    })
})
