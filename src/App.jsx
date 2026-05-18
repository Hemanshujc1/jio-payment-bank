import React, {useEffect } from "react";

import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import SavingsVariantPage from './pages/SavingsVariantPage'
import OnboardingFlowPage from './pages/OnboardingFlowPage'
import { ToastProvider } from './components/ui/Toast'




const App = () => {

  useEffect(() => {
    fetch("https://localhost:3000/validate", {
      credentials: "include"
    })
      .then(res => {
        if (res.status === 401) {
          window.location.href = "https://localhost:3000/auth";
        }
      })
      .catch(err => {
        console.log("Server Error:", err);
        window.location.href = "https://localhost:3000/auth";
      });

  }, []);

  
  return (
    <ToastProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="grow w-full max-w-7xl mx-auto flex flex-col pt-1 px-2 sm:px-4 pb-0 overflow-hidden">
          <Routes>
            <Route path="/" element={<SavingsVariantPage />} />
            <Route path="/onboarding-flow" element={<OnboardingFlowPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </ToastProvider>
  )
}

export default App