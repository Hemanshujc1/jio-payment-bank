import React, { useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import SavingsVariantPage from './pages/SavingsVariantPage'
import OnboardingFlowPage from './pages/OnboardingFlowPage'
import RefundFlowPage from './pages/RefundFlowPage'
import ResendVoucher from './pages/ResendVoucher'
import { ToastProvider } from './components/ui/Toast'

const App = () => {
 const [isValidating, setIsValidating] = useState(true);
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://localhost:3000";

    fetch(`${backendUrl}/validate`, {
      credentials: "include"
    })
      .then(res => {
        if (res.status === 401) {
          window.location.href = `${backendUrl}`;
        } else {
          setIsValidating(false);
        }
      })
      .catch(err => {
        console.log("Server Error:", err);
        window.location.href = `${backendUrl}`;
      });

  }, []);

 if (isValidating) {
    return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF7F0] text-brown-900 font-sans">
     <div className="relative flex items-center justify-center">
          {/* Outer elegant spinner (Sand theme) */}
          {/* <div className="absolute w-24 h-24 rounded-full border-4 border-sand-300 border-t-brown-600 border-b-brown-600 animate-spin"></div> */}
          {/* Inner solid spinner (Brown theme) */}
          {/* <div className="w-16 h-16 rounded-full border-4 border-t-brown-800 border-r-transparent border-b-brown-800 border-l-transparent animate-spin [animation-duration:1.2s]"></div> */}
          {/* Glowing central core (Rich gold/brown glow) */}
          {/* <div className="absolute w-4 h-4 bg-brown-700 rounded-full shadow-[0_0_20px_rgba(139,92,26,0.6)]"></div> */}
        <div className="rounded-full overflow-hidden w-32 h-32 animate-bounce">
          <img src="./logo.jpeg" alt="Vakrangee Logo" />
          </div>
        </div>
        <h2 className="mt-10 text-xl font-bold tracking-widest text-brown-800 uppercase animate-pulse">
          Securing Session
        </h2>
        <p className="mt-3 text-sm text-brown-600/80 font-medium tracking-wide">
          Verifying your authentication. Please wait...
        </p>
      </div>
    );
  } 

  return (
    <ToastProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="grow w-full max-w-7xl mx-auto flex flex-col pt-1 px-2 sm:px-4 pb-0 overflow-hidden">
          <Routes>
            <Route path="/" element={<SavingsVariantPage />} />
            <Route path="/onboarding-flow" element={<OnboardingFlowPage />} />
            <Route path="/refund-flow" element={<RefundFlowPage />} />
            <Route path="/resend-voucher-code-flow" element={<ResendVoucher />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </ToastProvider>
  )
}

export default App