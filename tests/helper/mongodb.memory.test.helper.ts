import { MongoMemoryServer } from "mongodb-memory-server";
import { connectToMongo, closeMongoConnection } from '@/lib/mongo'

let mongoDB: MongoMemoryServer;

export const connectTestMongo = async () => {
    mongoDB = await MongoMemoryServer.create()
    process.env.MONGODB_URI = mongoDB.getUri()
    await connectToMongo()
}


export const disconnectTestMongo = async () => {
    await closeMongoConnection()
    await mongoDB.stop()
}