import { useReducer } from 'react'
import { buildPushMessage, validatePushForm, type PushTextField } from '../push/message'
import type { RecipientKind } from '../push/recipients'
import type { PushService } from '../push/types'
import { initialPushFormState, pushFormReducer } from './pushFormReducer'

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : String(err))

/** Единое состояние формы и команды над ним. Транспорт приходит снаружи — через интерфейс PushService */
export function usePushForm(service: PushService) {
  const [state, dispatch] = useReducer(pushFormReducer, initialPushFormState)

  async function loadKey(json: string) {
    try {
      dispatch({ type: 'keyLoaded', account: await service.loadServiceAccount(json) })
    } catch (err) {
      dispatch({ type: 'keyRejected', error: errorMessage(err) })
    }
  }

  async function submit() {
    const { account, form, status } = state
    if (status.kind === 'sending') return
    if (!account) return dispatch({ type: 'validationFailed', error: 'Добавьте ключ сервисного аккаунта' })
    const error = validatePushForm(form)
    if (error) return dispatch({ type: 'validationFailed', error })

    dispatch({ type: 'sendStarted' })
    try {
      dispatch({ type: 'sendSucceeded', messageId: await service.send(account, buildPushMessage(form)) })
    } catch (err) {
      dispatch({ type: 'sendFailed', error: errorMessage(err) })
    }
  }

  return {
    state,
    loadKey,
    clearKey: () => dispatch({ type: 'keyCleared' }),
    setRecipientKind: (kind: RecipientKind) => dispatch({ type: 'recipientKindChanged', kind }),
    setRecipient: (value: string) => dispatch({ type: 'recipientChanged', value }),
    setText: (field: PushTextField, value: string) => dispatch({ type: 'textChanged', field, value }),
    submit,
  }
}
