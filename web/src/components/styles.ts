export const labelClass = 'mb-1.5 block text-sm font-medium'

export const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950'

/** Отключает всё, что может отправить или запомнить содержимое поля: проверку орфографии, автозаполнение, менеджеры паролей */
export const noTrackingProps = {
  spellCheck: false,
  autoComplete: 'off',
  autoCorrect: 'off',
  autoCapitalize: 'off',
  'data-1p-ignore': true,
  'data-lpignore': 'true',
  'data-form-type': 'other',
} as const
