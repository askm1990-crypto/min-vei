import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

/* Global styles — order matters */
import './styles/tokens.css'
import './styles/dark-mode.css'
import './styles/reset.css'
import './styles/animations.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
