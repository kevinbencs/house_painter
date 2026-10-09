import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { SignJWT } from 'jose'
import { generateSecret, generate } from 'otplib'
import type { BrowserContext, TestInfo } from '@playwright/test'

// Must match tests/helper/e2e-server.mts
export const MONGO_URI = `mongodb://127.0.0.1:${process.env.E2E_MONGO_PORT ?? 27027}/`
export const JWT_SECRET = 'test-secret'
export const JWT_SECRET_TWOFA = 'test-secret'
export const BASE_URL = 'http://localhost:3000'

export const connectDb = async () => {
    if (mongoose.connection.readyState !== 1) await mongoose.connect(MONGO_URI)
}

export const disconnectDb = async () => {
    await mongoose.disconnect()
}

const admins = () => mongoose.connection.collection('admins')

// Tests run in parallel across browsers against one database, so every
// test gets its own email address.
export const uniqueEmail = (testInfo: TestInfo) =>
    `admin-${testInfo.project.name}-${testInfo.testId}-${Date.now()}@test.com`.toLowerCase()

export const seedAdmin = async ({ email, password, twofa }: { email: string, password: string, twofa: string }) => {
    const now = new Date()
    const { insertedId } = await admins().insertOne({
        email,
        password: await bcrypt.hash(password, 10),
        twofa,
        createdAt: now,
        updatedAt: now,
    })
    return String(insertedId)
}

export const deleteAdmin = (email: string) => admins().deleteOne({ email })

export const newTwoFASecret = () => generateSecret()
export const totpFor = (secret: string) => generate({ secret })

const sign = (id: string, secret: string) =>
    new SignJWT({ id, expiresAt: new Date(Date.now() + 1000 * 60 * 10) })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('10m')
        .sign(new TextEncoder().encode(secret))

export const setAuthCookie = async (context: BrowserContext, adminId: string) =>
    context.addCookies([{ name: 'AuthToken', value: await sign(adminId, JWT_SECRET), url: BASE_URL }])

export const setTwoFACookie = async (context: BrowserContext, adminId: string) =>
    context.addCookies([{ name: '2fa', value: await sign(adminId, JWT_SECRET_TWOFA), url: BASE_URL }])
