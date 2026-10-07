import type { ReactNode } from 'react'

const tones = {
  success:
    'bg-emerald-50 text-emerald-900 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900',
  error: 'bg-red-50 text-red-900 ring-red-200 dark:bg-red-950/40 dark:text-red-200 dark:ring-red-900',
  warning: 'bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900',
}

interface NoticeProps {
  tone: keyof typeof tones
  title?: string
  role?: 'status'
  children: ReactNode
}

export function Notice({ tone, title, role, children }: NoticeProps) {
  return (
    <div role={role} className={`rounded-lg p-3 text-sm ring-1 ${tones[tone]}`}>
      {title && <div className="font-medium">{title}</div>}
      <div className={title ? 'mt-0.5 wrap-anywhere' : undefined}>{children}</div>
    </div>
  )
}
