import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index2.css'
import './index3.css'
import './index1.css'
import './indexB.css'
import './sidebarIndex.css'
import './pageWidthFix.css'
import './index_new.css'
import Website from './Website.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Website />
  </StrictMode>,
)