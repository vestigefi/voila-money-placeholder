import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import App from './App'
import './index.css'

const theme = localStorage.getItem('theme') || 'light'
if (theme === 'dark') {
  document.body.classList.add('dark')
} else {
  document.body.classList.remove('dark')
}
const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(<App />)
