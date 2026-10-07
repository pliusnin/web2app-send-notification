import { useRef, useState, type DragEvent } from 'react'
import { usePreventFileDropOutside } from '../hooks/usePreventFileDropOutside'
import { isAdminServiceAccount } from '../push/serviceAccount'
import type { ServiceAccount } from '../push/types'
import { Notice } from './Notice'
import { inputClass, labelClass, noTrackingProps } from './styles'

interface KeyInputProps {
  account: ServiceAccount | null
  error: string | null
  onLoad(json: string): void
  onClear(): void
}

export function KeyInput({ account, error, onLoad, onClear }: KeyInputProps) {
  usePreventFileDropOutside()

  return (
    <section className="space-y-2">
      <span className={labelClass}>Ключ сервисного аккаунта</span>
      {account ? <AccountCard account={account} onClear={onClear} /> : <KeyDropZone onLoad={onLoad} />}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {account && isAdminServiceAccount(account) && (
        <Notice tone="warning">
          Это админский ключ Firebase с полным доступом к проекту. Безопаснее использовать отдельный сервисный
          аккаунт только с ролью «Firebase Cloud Messaging API Admin».
        </Notice>
      )}
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Ключ не сохраняется: он хранится только в памяти этой вкладки и пропадает при её закрытии или
        перезагрузке.
      </p>
    </section>
  )
}

function AccountCard({ account, onClear }: { account: ServiceAccount; onClear(): void }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg bg-emerald-50 p-3 text-sm ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:ring-emerald-900">
      <div className="min-w-0">
        <div className="font-medium">{account.projectId}</div>
        <div className="truncate text-slate-600 dark:text-slate-400">{account.clientEmail}</div>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="shrink-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
      >
        Убрать
      </button>
    </div>
  )
}

// Поле принимает ключ только через вставку, перетаскивание или выбор файла.
// Текст в него не попадает: ключ сразу превращается в CryptoKey, а поле остаётся пустым
function KeyDropZone({ onLoad }: { onLoad(json: string): void }) {
  // Подсветка при перетаскивании — визуальное состояние только этого поля, приложению оно не нужно
  const [dragging, setDragging] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const loadFile = (file: File | undefined) => {
    if (file) void file.text().then(onLoad)
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) loadFile(file)
    else onLoad(e.dataTransfer.getData('text'))
  }

  return (
    <div className="space-y-2">
      <textarea
        {...noTrackingProps}
        aria-label="Ключ сервисного аккаунта"
        rows={3}
        value=""
        onChange={() => {}}
        onPaste={(e) => {
          e.preventDefault()
          onLoad(e.clipboardData.getData('text'))
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        placeholder="Вставьте содержимое service-account.json (⌘V) или перетащите файл сюда"
        className={`${inputClass} resize-none border-dashed ${dragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' : ''}`}
      />
      <button
        type="button"
        onClick={() => fileInput.current?.click()}
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 ring-1 ring-indigo-200 hover:bg-indigo-50 dark:text-indigo-400 dark:ring-indigo-900 dark:hover:bg-indigo-950/40"
      >
        Выбрать файл…
      </button>
      <input
        ref={fileInput}
        type="file"
        accept=".json,application/json"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          loadFile(file)
        }}
      />
    </div>
  )
}
