export interface ServiceAccount {
  readonly projectId: string
  readonly clientEmail: string
  /** Импортирован как non-extractable: им можно подписать, но прочитать обратно нельзя */
  readonly privateKey: CryptoKey
}

export type MessageTarget = { readonly topic: string } | { readonly token: string }

export type PushMessage = MessageTarget & {
  readonly notification: { readonly title: string; readonly body?: string }
}

/** Всё, что приложению нужно от транспорта уведомлений. UI зависит только от этого интерфейса */
export interface PushService {
  loadServiceAccount(json: string): Promise<ServiceAccount>
  /** Возвращает id отправленного сообщения */
  send(account: ServiceAccount, message: PushMessage): Promise<string>
}
