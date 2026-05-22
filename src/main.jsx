// The main file is called as a script in the index.html file
// Its purpose is to render the app through the proper method

// Imports
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'katex/dist/katex.min.css' // Imported from KaTeX - Ensures all math in app is styled correctly

// Render App component
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
