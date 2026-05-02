export async function setupGracefulShutdown() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const {closeMongoConnection} = await import ('./lib/mongo')
        const shutdownSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

        shutdownSignals.forEach((signal) => {
            process.on(signal, async () => {

                console.log(`Received ${signal}, shutting down gracefully...`);
                await closeMongoConnection();
                process.exit(0);
            });
        });
    }

}

export const register = async () => {
    try {
        if (process.env.NEXT_RUNTIME === 'nodejs') {
            const { connectToMongo } = await import('./lib/mongo');
            await connectToMongo()
            console.log('MongoDB initialized during server lifecycle');
        }

    } catch (error) {
        console.log('Failed to connect to MongoDB during server lifecycle', error)
    }
}