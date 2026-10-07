import type { RecipientKind } from '../push/recipients'
import { inputClass, labelClass, noTrackingProps } from './styles'

const recipientLabels: Record<RecipientKind, { label: string; placeholder: string; monospace: boolean }> = {
  topic: { label: 'Топик', placeholder: 'all', monospace: false },
  token: { label: 'Токен устройства', placeholder: 'FCM-токен устройства', monospace: true },
}

const recipientKindOptions = Object.keys(recipientLabels) as RecipientKind[]

interface RecipientFieldProps {
  kind: RecipientKind
  value: string
  onKindChange(kind: RecipientKind): void
  onValueChange(value: string): void
}

export function RecipientField({ kind, value, onKindChange, onValueChange }: RecipientFieldProps) {
  const current = recipientLabels[kind]

  return (
    <section>
      <span className={labelClass}>Получатель</span>
      <div className="mb-2 inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        {recipientKindOptions.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === kind}
            onClick={() => onKindChange(option)}
            className={`rounded-md px-3 py-1 text-sm font-medium ${
              option === kind
                ? 'bg-white shadow-sm dark:bg-slate-950'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            {recipientLabels[option].label}
          </button>
        ))}
      </div>
      <input
        {...noTrackingProps}
        aria-label={current.label}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={current.placeholder}
        className={`${inputClass} ${current.monospace ? 'font-mono' : ''}`}
      />
    </section>
  )
}
