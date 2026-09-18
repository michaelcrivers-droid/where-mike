import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { APP_NAME } from './config'
import './index.css'

const container = document.getElementById('root')
if (!container) throw new Error('Missing #root')

// index.html ships a literal so the tab is never blank before JS runs; this
// keeps it honest once APP_NAME is the single source of truth.
document.title = APP_NAME

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
