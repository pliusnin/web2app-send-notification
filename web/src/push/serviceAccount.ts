import type { ServiceAccount } from './types'

interface ServiceAccountJson {
  type?: unknown
  project_id?: unknown
  client_email?: unknown
  private_key?: unknown
}

export async function parseServiceAccount(json: string): Promise<ServiceAccount> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Браузер отключил Web Crypto для этой страницы — откройте файл напрямую (file://) или через localhost')
  }
  const data = parseJsonObject(json)
  if (
    data.type !== 'service_account' ||
    typeof data.project_id !== 'string' ||
    typeof data.client_email !== 'string' ||
    typeof data.private_key !== 'string'
  ) {
    throw new Error('Это не похоже на service-account.json')
  }
  return {
    projectId: data.project_id,
    clientEmail: data.client_email,
    privateKey: await importPrivateKey(data.private_key),
  }
}

/** Ключ firebase-adminsdk даёт полный доступ к проекту, а не только к FCM */
export const isAdminServiceAccount = (account: ServiceAccount) => account.clientEmail.startsWith('firebase-adminsdk-')

function parseJsonObject(json: string): ServiceAccountJson {
  let data: unknown
  try {
    data = JSON.parse(json)
  } catch {
    throw new Error('Не удалось прочитать JSON')
  }
  if (typeof data !== 'object' || data === null) throw new Error('Это не похоже на service-account.json')
  return data as ServiceAccountJson
}

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  try {
    const base64 = pem.replace(/-----(BEGIN|END) PRIVATE KEY-----/g, '').replace(/\s+/g, '')
    const der = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0))
    return await crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign'])
  } catch {
    throw new Error('Не удалось прочитать private_key')
  }
}
