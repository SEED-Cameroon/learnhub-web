import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AllTutors from './components/mentors/AllTutors'

const App = () => {
  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<LandingPage />} 
    />
    <Route path="/mentors/all" element={<AllTutors />} 
    />
   </Routes>
   </BrowserRouter>
  )
}

export default App