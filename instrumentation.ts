import { type Instrumentation } from 'next'

const REQUIRED_ENV_VARS = [
    'BLOB_READ_WRITE_TOKEN',
    'MONGODB_URI',
    'BLOB_ID',
    'JWT_SECRET_Long',
    'JWT_SECRET_Short',
    'JWT_SECRET_URL',
    'JWT_SECRET_TWOFA',
    'URL',
    'RESEND',
    'DISCORD'
] as const;


export const checkENV = async () => {


    const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        missing.forEach((key) => console.error(`Missing env var: ${key}`));
        console.error(`Server startup aborted: missing env vars: ${missing.join(', ')}`);
        process.exit(1);
    }

}

export const register = async () => {


    if (process.env.NEXT_RUNTIME === 'nodejs') {
        checkENV();

        try {
            const { connectToMongo } = await import('./lib/mongo');
            await connectToMongo()
            console.log('MongoDB initialized during server lifecycle');

        } catch (error) {
            console.error('Failed to connect to MongoDB during server lifecycle', error)
        }

        const { closeMongoConnection } = await import('./lib/mongo')
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


export const onRequestError: Instrumentation.onRequestError = async (
    err,
    request,
    context
) => {

    console.error(err)
    const message = err instanceof Error ? err.message : String(err)
    const digest =
        typeof err === 'object' && err !== null && 'digest' in err
            ? String(err.digest)
            : undefined

    await fetch(process.env.DISCORD!, {
        method: 'POST',
        body: JSON.stringify({
            content: `🚨 Server error on ${request.path}\n\`\`\`${message}\`\`\`\n${digest}\n${context}`,
            
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    }).catch(() => {}) 
}
