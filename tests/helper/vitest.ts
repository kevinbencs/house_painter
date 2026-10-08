import { afterAll, afterEach, beforeAll } from 'vitest'
import { connectTestMongo, disconnectTestMongo } from './mongodb.memory.test.helper'
import mongoose from 'mongoose'

export const useTestDb = () => {
    beforeAll(async () => {
        await connectTestMongo()
        // Mongoose builds unique indexes in the background after connecting.
        // Wait for them, or a duplicate-key test can run before the index
        // exists and the duplicate is saved (seen on slower CI runners).
        await Promise.all(Object.values(mongoose.models).map((model) => model.init()))
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
