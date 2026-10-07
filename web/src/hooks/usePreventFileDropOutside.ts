import { useEffect } from 'react'

/** Файл, брошенный мимо поля, браузер открыл бы во вкладке — а это ключ */
export function usePreventFileDropOutside() {
  useEffect(() => {
    const prevent = (e: DragEvent) => e.preventDefault()
    window.addEventListener('dragover', prevent)
    window.addEventListener('drop', prevent)
    return () => {
      window.removeEventListener('dragover', prevent)
      window.removeEventListener('drop', prevent)
    }
  }, [])
}
