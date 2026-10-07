import { fetchAccessToken } from './googleAuth'
import { requestJson } from './http'
import { parseServiceAccount } from './serviceAccount'
import type { PushMessage, PushService } from './types'

interface SendResponse {
  name: string
  error: { message?: string; details?: { errorCode?: string }[] }
}

/** Реализация PushService поверх FCM HTTP v1 — без firebase-admin и без своего сервера */
export function createFcmPushService(): PushService {
  return {
    loadServiceAccount: parseServiceAccount,
    async send(account, message) {
      return sendMessage(await fetchAccessToken(account), account.projectId, message)
    },
  }
}

async function sendMessage(accessToken: string, projectId: string, message: PushMessage): Promise<string> {
  const { ok, status, data } = await requestJson<SendResponse>(
    `https://fcm.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/messages:send`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    },
  )
  if (!ok || !data.name) {
    const fcmCode = data.error?.details?.find((detail) => detail.errorCode)?.errorCode
    throw new Error([fcmCode, data.error?.message ?? `HTTP ${status}`].filter(Boolean).join(': '))
  }
  return data.name
}
