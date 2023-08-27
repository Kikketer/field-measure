/* @refresh reload */
import { render } from 'solid-js/web'
import './styles.css'
import './pico.min.css'
import SolidSvg from 'vite-plugin-solid-svg'
import App from './components/App'

// Sets up the SVG loader to be able to import SVGs as components
SolidSvg({
  defaultAsComponent: true,
})

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  )
}

render(() => <App />, root!)
