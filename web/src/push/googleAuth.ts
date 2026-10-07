import { requestJson } from './http'
import type { ServiceAccount } from './types'

// OAuth 2.0 JWT bearer flow: подписываем JWT ключом сервисного аккаунта и меняем его на access token —
// то же, что firebase-admin делает под капотом

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const FCM_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'

interface TokenResponse {
  access_token: string
  error: string
  error_description: string
}

export async function fetchAccessToken(account: ServiceAccount): Promise<string> {
  const { ok, status, data } = await requestJson<TokenResponse>(TOKEN_URL, {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: await createJwt(account),
    }),
  })
  if (!ok || !data.access_token) {
    throw new Error(`Авторизация не прошла: ${data.error_description ?? data.error ?? `HTTP ${status}`}`)
  }
  return data.access_token
}

async function createJwt({ clientEmail, privateKey }: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const unsigned = `${encodeJson({ alg: 'RS256', typ: 'JWT' })}.${encodeJson({
    iss: clientEmail,
    scope: FCM_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  })}`
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', privateKey, new TextEncoder().encode(unsigned))
  return `${unsigned}.${base64url(new Uint8Array(signature))}`
}

const base64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

const encodeJson = (value: unknown) => base64url(new TextEncoder().encode(JSON.stringify(value)))
