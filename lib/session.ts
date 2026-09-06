import 'server-only'
import {SignJWT, jwtVerify} from 'jose'


const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET)
const encodedTwoFAKey= new TextEncoder().encode(process.env.JWT_SECRET_TWOFA)
const encodedURLKey= new TextEncoder().encode(process.env.JWT_SECRET_URL)

export async function encryptJWT(payload: { id: string, expiresAt: Date }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function encryptTwoFA(payload: { id: string, expiresAt: Date }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedTwoFAKey)
}

export async function encryptURL(payload: { id: string, expiresAt: Date }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedURLKey)
}


 
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}


export async function decryptTwoFA(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedTwoFAKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}


export async function decryptURL(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedURLKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}

