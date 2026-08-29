import * as ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { AuthSessionProvider } from './services/session'
import './index.css'

const runtimeBasename = import.meta.env.BASE_URL === './' ? '/' : import.meta.env.BASE_URL
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element is missing')
}

ReactDOM.createRoot(rootElement).render(
  <BrowserRouter basename={runtimeBasename}>
    <AuthSessionProvider>
      <App />
    </AuthSessionProvider>
  </BrowserRouter>,
)
