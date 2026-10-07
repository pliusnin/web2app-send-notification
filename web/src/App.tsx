import { KeyInput } from './components/KeyInput'
import { MessageFields } from './components/MessageFields'
import { RecipientField } from './components/RecipientField'
import { SendStatusMessage } from './components/SendStatusMessage'
import type { PushService } from './push/types'
import { usePushForm } from './state/usePushForm'

export function App({ service }: { service: PushService }) {
  const { state, loadKey, clearKey, setRecipientKind, setRecipient, setText, submit } = usePushForm(service)
  const { form, status } = state
  const sending = status.kind === 'sending'

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          void submit()
        }}
        className="mx-auto max-w-lg space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
      >
        <header>
          <h1 className="text-xl font-semibold">Push-уведомление</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Firebase Cloud Messaging</p>
        </header>

        <KeyInput account={state.account} error={state.keyError} onLoad={loadKey} onClear={clearKey} />

        <RecipientField
          kind={form.recipientKind}
          value={form.recipients[form.recipientKind]}
          onKindChange={setRecipientKind}
          onValueChange={setRecipient}
        />

        <MessageFields title={form.title} body={form.body} onChange={setText} />

        <button
          type="submit"
          disabled={sending}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? 'Отправка…' : 'Отправить'}
        </button>

        <SendStatusMessage status={status} />
      </form>
    </main>
  )
}
