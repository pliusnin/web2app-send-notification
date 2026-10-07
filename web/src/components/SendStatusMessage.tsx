import type { SendStatus } from '../state/pushFormReducer'
import { Notice } from './Notice'

export function SendStatusMessage({ status }: { status: SendStatus }) {
  switch (status.kind) {
    case 'sent':
      return (
        <Notice tone="success" title="Отправлено" role="status">
          <span className="font-mono text-xs">{status.messageId}</span>
        </Notice>
      )
    case 'failed':
      return (
        <Notice tone="error" title="Ошибка" role="status">
          {status.error}
        </Notice>
      )
    default:
      return null
  }
}
