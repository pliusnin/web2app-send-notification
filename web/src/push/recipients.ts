import type { MessageTarget } from './types'

// Способы адресации сообщения. Новый способ (например, condition) — это новая запись здесь
// и подпись в RecipientField; валидация, сборка сообщения и состояние подхватят его сами

interface RecipientKindRules {
  /** Текст ошибки или null, если значение корректно */
  validate(value: string): string | null
  toTarget(value: string): MessageTarget
}

const TOPIC_PATTERN = /^[a-zA-Z0-9-_.~%]+$/
const normalizeTopic = (value: string) => value.trim().replace(/^\/topics\//, '')

export const recipientKinds = {
  topic: {
    validate: (value) =>
      TOPIC_PATTERN.test(normalizeTopic(value))
        ? null
        : 'Название топика может содержать только буквы, цифры и символы - _ . ~ %',
    toTarget: (value) => ({ topic: normalizeTopic(value) }),
  },
  token: {
    validate: (value) => (value.trim() ? null : 'Укажите токен устройства'),
    toTarget: (value) => ({ token: value.trim() }),
  },
} satisfies Record<string, RecipientKindRules>

export type RecipientKind = keyof typeof recipientKinds
