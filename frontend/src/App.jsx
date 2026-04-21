import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Pricing from './components/Pricing'
import Testimonials from './components/Testimonials'
import CTA from './components/CTA'
import VoiceCall from './components/VoiceCall'

function App() {
  const [isCallOpen, setIsCallOpen] = useState(false)

  const openCall = () => setIsCallOpen(true)
  const closeCall = () => setIsCallOpen(false)

  return (
    <div className="app">
      <Navbar onCallClick={openCall} />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <CTA onCallClick={openCall} />
      <VoiceCall isOpen={isCallOpen} onClose={closeCall} />
    </div>
  )
}

export default App