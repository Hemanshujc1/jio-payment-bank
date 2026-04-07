import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import SavingsVariantPage from './pages/SavingsVariantPage'
import OnboardingFlowPage from './pages/OnboardingFlowPage'

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="grow w-full max-w-7xl mx-auto p-4 md:p-8">
        <Routes>
          <Route path="/" element={<SavingsVariantPage />} />
          <Route path="/onboarding-flow" element={<OnboardingFlowPage />} />

          {/* <Route path="/otp" element={<OtpPage />} /> */}
          {/* <Route path="/agent-otp" element={<AgentOtpPage />} /> */}
          {/* <Route path="/authmode" element={<AuthModePage />} /> */}
          {/* <Route path="/login" element={<LoginPage />} /> */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/mobile-validation-success" element={<MobileValidationSuccessPage />} /> */}
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App