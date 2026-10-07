import { recipientKinds, type RecipientKind } from './recipients'
import type { PushMessage } from './types'

export interface PushForm {
  readonly recipientKind: RecipientKind
  /** Значение для каждого способа адресации — при переключении введённое не теряется */
  readonly recipients: Readonly<Record<RecipientKind, string>>
  readonly title: string
  readonly body: string
}

export type PushTextField = 'title' | 'body'

export function validatePushForm(form: PushForm): string | null {
  const recipientError = recipientKinds[form.recipientKind].validate(form.recipients[form.recipientKind])
  if (recipientError) return recipientError
  return form.title.trim() ? null : 'Укажите заголовок'
}

export function buildPushMessage(form: PushForm): PushMessage {
  const title = form.title.trim()
  const body = form.body.trim()
  return {
    ...recipientKinds[form.recipientKind].toTarget(form.recipients[form.recipientKind]),
    notification: body ? { title, body } : { title },
  }
}
