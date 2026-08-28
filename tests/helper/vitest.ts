import { afterAll, afterEach, beforeAll } from 'vitest'
import { connectTestMongo, disconnectTestMongo } from './mongodb.memory.test.helper'
import mongoose from 'mongoose'

export const useTestDb = () => {
    beforeAll(async () => {
        await connectTestMongo()
    })

    afterEach(async () => {
        const { collections } = mongoose.connection
        for (const key of Object.keys(collections)) {
            await collections[key].deleteMany({})
        }
    })

    afterAll(async () => {
        await disconnectTestMongo()
    })
}
