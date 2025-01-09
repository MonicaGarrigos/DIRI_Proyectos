import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import EnrolmentForm from './components/EnrolmentForm'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EnrolmentForm/>
  </StrictMode>,
)
