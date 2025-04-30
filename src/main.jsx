import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Update to the correct relative path
import App from './App.jsx' // Update to the correct relative path


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
