import type { PushForm, PushTextField } from '../push/message'
import type { RecipientKind } from '../push/recipients'
import type { ServiceAccount } from '../push/types'

export type SendStatus =
  | { readonly kind: 'idle' }
  | { readonly kind: 'sending' }
  | { readonly kind: 'sent'; readonly messageId: string }
  | { readonly kind: 'failed'; readonly error: string }

export interface PushFormState {
  /** Ключ живёт только в памяти вкладки: нигде не сохраняется и пропадает при её закрытии или перезагрузке */
  readonly account: ServiceAccount | null
  readonly keyError: string | null
  readonly form: PushForm
  readonly status: SendStatus
}

export type PushFormAction =
  | { type: 'keyLoaded'; account: ServiceAccount }
  | { type: 'keyRejected'; error: string }
  | { type: 'keyCleared' }
  | { type: 'recipientKindChanged'; kind: RecipientKind }
  | { type: 'recipientChanged'; value: string }
  | { type: 'textChanged'; field: PushTextField; value: string }
  | { type: 'validationFailed'; error: string }
  | { type: 'sendStarted' }
  | { type: 'sendSucceeded'; messageId: string }
  | { type: 'sendFailed'; error: string }

export const initialPushFormState: PushFormState = {
  account: null,
  keyError: null,
  form: { recipientKind: 'topic', recipients: { topic: 'all', token: '' }, title: '', body: '' },
  status: { kind: 'idle' },
}

export function pushFormReducer(state: PushFormState, action: PushFormAction): PushFormState {
  switch (action.type) {
    case 'keyLoaded':
      return { ...state, account: action.account, keyError: null, status: { kind: 'idle' } }
    case 'keyRejected':
      return { ...state, account: null, keyError: action.error }
    case 'keyCleared':
      return { ...state, account: null }
    case 'recipientKindChanged':
      return { ...state, form: { ...state.form, recipientKind: action.kind } }
    case 'recipientChanged':
      return {
        ...state,
        form: { ...state.form, recipients: { ...state.form.recipients, [state.form.recipientKind]: action.value } },
      }
    case 'textChanged':
      return { ...state, form: { ...state.form, [action.field]: action.value } }
    case 'validationFailed':
      return { ...state, status: { kind: 'failed', error: action.error } }
    case 'sendStarted':
      return { ...state, status: { kind: 'sending' } }
    case 'sendSucceeded':
      return { ...state, status: { kind: 'sent', messageId: action.messageId } }
    case 'sendFailed':
      return { ...state, status: { kind: 'failed', error: action.error } }
  }
}
