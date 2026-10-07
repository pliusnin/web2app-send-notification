import type { PushTextField } from '../push/message'
import { inputClass, labelClass } from './styles'

interface MessageFieldsProps {
  title: string
  body: string
  onChange(field: PushTextField, value: string): void
}

export function MessageFields({ title, body, onChange }: MessageFieldsProps) {
  return (
    <section className="space-y-4">
      <div>
        <label htmlFor="title" className={labelClass}>
          Заголовок
        </label>
        <input id="title" value={title} onChange={(e) => onChange('title', e.target.value)} className={inputClass} />
      </div>
      <div>
        <label htmlFor="body" className={labelClass}>
          Текст
        </label>
        <textarea
          id="body"
          rows={3}
          value={body}
          onChange={(e) => onChange('body', e.target.value)}
          className={`${inputClass} resize-y`}
        />
      </div>
    </section>
  )
}
