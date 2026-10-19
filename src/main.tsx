import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import 'lenis/dist/lenis.css'
import ScrollExperience from './components/ScrollExperience'
import './design-system.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ScrollExperience>
    <App />
  </ScrollExperience>,
)
