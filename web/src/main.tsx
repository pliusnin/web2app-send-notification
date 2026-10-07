import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { createFcmPushService } from './push/fcm'
import './index.css'

// Точка сборки: только здесь выбирается реализация PushService, остальной код знает лишь интерфейс
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App service={createFcmPushService()} />
  </StrictMode>,
)
