/* @refresh reload */
import { Route, Router, Routes } from '@solidjs/router'
import { render } from 'solid-js/web'
import App from './components/App'
import './pico.min.css'
import './styles.css'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  )
}

render(
  () => (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  ),
  root!,
)
