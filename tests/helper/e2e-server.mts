import { MongoMemoryServer } from 'mongodb-memory-server'
import { spawn } from 'node:child_process'

const mongod = await MongoMemoryServer.create()

const env = {
  ...process.env,
  MONGODB_URI: mongod.getUri(),
  // Every var your instrumentation.ts checkENV() requires — otherwise the
  // server calls process.exit(1) on boot. Dummy values are fine for E2E.
  BLOB_READ_WRITE_TOKEN: 'test',
  BLOB_ID: 'test',
  JWT_SECRET_Long: 'test-secret',
  JWT_SECRET_Short: 'test-secret',
  JWT_SECRET_URL: 'test-secret',
  JWT_SECRET_TWOFA: 'test-secret',
  URL: 'http://localhost:3000',
  RESEND: 'test',
  EMAIL: 'test@example.com',
  DISCORD: 'http://127.0.0.1:9/noop',  // unreachable on purpose: no real webhook spam
  DISCORD_USER_ID: '0',
}

// `next start` needs a prior `next build`. For quick local runs with no build,
// swap 'start' → 'dev' below.
const child = spawn('npx', ['next', 'start'], { env, stdio: 'inherit' })

const shutdown = async () => {
  child.kill('SIGTERM')
  await mongod.stop()
  process.exit(0)
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
child.on('exit', (code) => { mongod.stop().finally(() => process.exit(code ?? 0)) })