import { closeMongoConnection, connectToMongo } from './lib/mongo';

export function setupGracefulShutdown() {
    const shutdownSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

    shutdownSignals.forEach((signal) => {
        process.on(signal, async () => {
            console.log(`Received ${signal}, shutting down gracefully...`);
            await closeMongoConnection();
            process.exit(0);
        });
    });
}

export const register =  async () => {
    try {
        await connectToMongo()
        console.log('MongoDB initialized during server lifecycle');
    } catch (error) {
        console.log('Failed to connect to MongoDB during server lifecycle',error)
    }
}