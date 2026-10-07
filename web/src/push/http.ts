export interface JsonResponse<T> {
  readonly ok: boolean
  readonly status: number
  /** Ответ внешнего API: ни одному полю не доверяем, все необязательные */
  readonly data: Partial<T>
}

export async function requestJson<T>(url: string, init: RequestInit): Promise<JsonResponse<T>> {
  let res: Response
  try {
    res = await fetch(url, { ...init, referrerPolicy: 'no-referrer' })
  } catch {
    throw new Error('Нет соединения с Google — проверьте интернет')
  }
  const data = (await res.json().catch(() => ({}))) as Partial<T>
  return { ok: res.ok, status: res.status, data }
}
