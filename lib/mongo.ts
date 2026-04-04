import mongoose from "mongoose";

declare global {
    var mongooseConnection: mongoose.Mongoose | undefined;
}

if (!global.mongooseConnection) {
    global.mongooseConnection = mongoose;
}


export const mongooseInstance = process.env.NODE_ENV === 'development' ? global.mongooseConnection : mongoose

export const connectToMongo = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('Missing process.env.MONGODB_URI');
            throw new Error('Missing process.env.MONGODB_URI');
        }

        if (mongooseInstance.connection.readyState === 1) {
            console.log('Using existing MongoDB connection');
            return mongooseInstance;
        }

        if (mongooseInstance.connection.readyState === 2) {
            console.log('MongoDB connection is in progress...');
            return mongooseInstance;
        }

        await mongooseInstance.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 30000, socketTimeoutMS: 45000 });
        console.log('MongoDB connected');

        return mongooseInstance;


    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw new Error('MongoDB connection failed');
    }
}

export const closeMongoConnection = async () => {
    try {
        const readyState = mongooseInstance.connection.readyState;
        if (readyState === 0) {
            console.log('MongoDB connection is already closed');
            return;
        }

        if (readyState === 3) {
            console.log('MongoDB connection is already closing...');
            return;
        }

        await mongooseInstance.connection.close();
        console.log('MongoDB connection closed');
        
        if (process.env.NODE_ENV === 'development') {
            global.mongooseConnection = undefined;
        }

    } catch (error) {
        console.error('Failed to close MongoDB connection:', error);
    }
}