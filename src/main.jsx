import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

/* Self-hosted fonts (works offline as a PWA) */
import '@fontsource-variable/figtree';
import '@fontsource-variable/bricolage-grotesque';

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
