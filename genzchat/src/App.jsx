import { useState } from 'react'
import './index.css'
import LandingPage from './pages/LandingPage'
import BackGroundAnimation from './components/BackGroundAnimation'
import { AuthProvider } from './context/AuthContext'

function App() {

  return (
    <AuthProvider>
     {/* <BackGroundAnimation /> */}
      <LandingPage/>
    </AuthProvider>
  )
}

export default App
